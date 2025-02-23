const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');

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

const upload = multer({ storage });

const safeUnlink = async (filePath) => {
    try {
        await fs.promises.unlink(filePath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`File not found for deletion: ${filePath}`);
        } else if (error.code === 'EPERM') {
            console.error(`Permission error deleting file: ${filePath}`, error);
        } else {
            console.error(`Error deleting file: ${filePath}`, error);
            throw error;
        }
    }
};

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
            const uploadDir = path.resolve(__dirname, 'uploads');
            const baseUrl =
                process.env.BASE_URL || 'https://buy-me-now-back.onrender.com/';

            for (const key in req.files) {
                const fileData = req.files[key];

                for (const file of fileData) {
                    const originalPath = file.path;
                    const ext = path.extname(file.originalname).toLowerCase();
                    let newFilename, newPath;

                    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                        newFilename = `${path.basename(
                            file.filename,
                            ext
                        )}.webp`;
                        newPath = path.join(uploadDir, newFilename);
                        await sharp(originalPath)
                            .webp({ quality: 80 })
                            .toFile(newPath);
                        await safeUnlink(originalPath);
                    } else {
                        newFilename = file.filename;
                        newPath = originalPath;
                    }

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

module.exports = dynamicFileMiddleware;
