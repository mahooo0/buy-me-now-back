const express = require('express');
const { getDynamicModel } = require('../models/DynamicModel');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const Logo = require('../models/LogoShema');
const uploadFolder = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}
const router = express.Router();
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
            const uploadDir = path.resolve(__dirname, '../uploads');

            // const uploadDir = path.join(__dirname, 'uploads'); // Adjust to your upload folder
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
// CREATE a new logo
router.post('/', dynamicFileMiddleware, async (req, res) => {
    try {
        const { type, image } = req.body;

        if (!type || !image) {
            return res
                .status(400)
                .json({ error: 'Invalid input: type and img are required' });
        }

        const logo = new Logo({ type, image });
        await logo.save();

        res.status(201).json({ message: 'Logo created successfully', logo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// // READ all logos or a specific logo by ID
router.get('/', async (req, res) => {
    try {
        // Get all logos
        const logos = await Logo.find();
        res.status(200).json(logos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// // UPDATE a logo by ID
router.put('/:id', dynamicFileMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { type, image } = req.body;

        if (!type || !image) {
            return res
                .status(400)
                .json({ error: 'Invalid input: type and image are required' });
        }

        const updatedLogo = await Logo.findByIdAndUpdate(
            id,
            { type, image },
            { new: true, runValidators: true }
        );

        if (!updatedLogo) {
            return res.status(404).json({ error: 'Logo not found' });
        }

        res.status(200).json({
            message: 'Logo updated successfully',
            logo: updatedLogo,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// // DELETE a logo by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedLogo = await Logo.findByIdAndDelete(id);
        if (!deletedLogo) {
            return res.status(404).json({ error: 'Logo not found' });
        }

        res.status(200).json({
            message: 'Logo deleted successfully',
            logo: deletedLogo,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
