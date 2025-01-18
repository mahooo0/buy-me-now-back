const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const sharp = require('sharp'); // For image processing
const { exec } = require('child_process'); // For video processing with FFmpeg
const ShemaRouter = require('./Routes/ShemaRouter');
const DataRouter = require('./Routes/DataRouter');
const userRoutes = require('./Routes/UsersRouter');
const SeoRoutes = require('./Routes/SeoRouter');
const LogoRoutes = require('./Routes/Logo');
const translationsRoutes = require('./Routes/TranslationRoter');
const {
    getDynamicModelOrCreate,
    getDynamicModel,
} = require('./models/DynamicModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(express.json());

// Setup multer for file uploads --start
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${extension}`);
    },
});
// Setup multer for file uploads ---end
const upload = multer({ storage });

// Middleware to handle mixed files with dynamic keys --start
const dynamicFileMiddleware = async (req, res, next) => {
    const fields = [
        { name: 'image', maxCount: 1 },
        { name: 'image_bg', maxCount: 1 },
        { name: 'image_meta', maxCount: 1 },
        { name: 'images', maxCount: 10 },
        { name: 'video', maxCount: 1 },
        { name: 'videos', maxCount: 10 },
        { name: 'pdf', maxCount: 1 },
    ];

    upload.fields(fields)(req, res, async (err) => {
        if (err) {
            return res
                .status(400)
                .json({ error: 'File upload error', details: err.message });
        }

        try {
            const uploadDir = path.join(__dirname, 'uploads'); // Adjust to your upload folder
            const baseUrl = process.env.BASE_URL || 'http://localhost:5000'; // Fallback for development

            for (const key in req.files) {
                const fileData = req.files[key];

                for (const file of fileData) {
                    const originalPath = file.path; // Original uploaded file path
                    const ext = path.extname(file.originalname).toLowerCase();
                    let newFilename, newPath;

                    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                        // Convert images to WebP
                        newFilename = `${path.basename(
                            file.filename,
                            ext
                        )}.webp`;
                        newPath = path.join(uploadDir, newFilename);
                        await sharp(originalPath)
                            .webp({ quality: 80 })
                            .toFile(newPath);
                        // Safely unlink the original file
                        await safeUnlink(originalPath);
                    } else {
                        // For videos and other files, keep as-is
                        newFilename = file.filename;
                        newPath = originalPath;
                    }

                    // Update req.body with the new file URL
                    const fileUrl = `${baseUrl}/uploads/${newFilename}`;
                    if (fileData.length === 1) {
                        req.body[key] = fileUrl;
                    } else {
                        req.body[key] = req.body[key] || [];
                        req.body[key].push(fileUrl);
                    }
                }
            }

            next();
        } catch (conversionError) {
            res.status(500).json({
                error: 'File processing error',
                details: conversionError.message,
            });
        }
    });
};

// Helper function for safe file deletion
const safeUnlink = async (filePath) => {
    try {
        await fs.promises.unlink(filePath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File does not exist, no need to delete
            console.warn(`File not found for deletion: ${filePath}`);
        } else if (error.code === 'EPERM') {
            // Windows-specific permission issue
            console.error(`Permission error deleting file: ${filePath}`, error);
        } else {
            // Other errors
            console.error(`Error deleting file: ${filePath}`, error);
            throw error; // Re-throw error if necessary
        }
    }
};

// Middleware to handle mixed files with dynamic keys --end

// MongoDB connection-start
const MONGO_URI =
    'mongodb+srv://sevinmuhammed06:mehemmed.1@cluster0.gbm6v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
// MongoDB connection-end
app.get('/', (req, res) => {
    res.send('Hi');
});
app.use('/shemaControl', ShemaRouter);
app.use('/DataControl', DataRouter);
app.use('/usersControll', userRoutes);
app.use('/translations', translationsRoutes);
app.use('/seo', SeoRoutes);
app.use('/logo', LogoRoutes);

// Serve static files
app.use('/uploads', express.static(uploadFolder));
// Serve static files

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
