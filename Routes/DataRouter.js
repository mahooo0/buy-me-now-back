const express = require('express');
const { getDynamicModel } = require('../models/DynamicModel');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
const multer = require('multer');
const sharp = require('sharp');
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

// Route to add a new document to a collection
router.post('/:collectionName', dynamicFileMiddleware, async (req, res) => {
    try {
        const { collectionName } = req.params;
        const document = req.body;

        if (!document) {
            return res
                .status(400)
                .json({ error: 'Missing required field: document' });
        }

        const DynamicModel = await getDynamicModel(collectionName);

        if (!DynamicModel) {
            return res
                .status(400)
                .json({ error: 'Schema not found for this collection' });
        }

        const schemaPaths = DynamicModel.schema.paths;

        if (
            schemaPaths.titleAz &&
            schemaPaths.slugAz &&
            document.titleAz &&
            !document.slugAz
        ) {
            document.slugAz = slugify(document.titleAz);
        }
        if (
            schemaPaths.titleEn &&
            schemaPaths.slugEn &&
            document.titleEn &&
            !document.slugEn
        ) {
            document.slugEn = slugify(document.titleEn);
        }
        if (
            schemaPaths.titleRu &&
            schemaPaths.slugRu &&
            document.titleRu &&
            !document.slugRu
        ) {
            document.slugRu = slugify(document.titleRu);
        }

        const newDocument = new DynamicModel(document);
        await newDocument.save();

        res.status(201).json({ success: true, data: newDocument });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to update a document by ID from a collection
router.put('/:collectionName/:id', dynamicFileMiddleware, async (req, res) => {
    try {
        const { collectionName, id } = req.params;
        const document = req.body;

        if (!document) {
            return res
                .status(400)
                .json({ error: 'Missing required field: document' });
        }

        const DynamicModel = await getDynamicModel(collectionName);

        if (!DynamicModel) {
            return res
                .status(400)
                .json({ error: 'Schema not found for this collection' });
        }

        const updatedDocument = await DynamicModel.findByIdAndUpdate(
            id,
            document,
            { new: true }
        );

        if (!updatedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json({ success: true, data: updatedDocument });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a document by ID from a collection
router.delete('/:collectionName/:id', async (req, res) => {
    try {
        const { collectionName, id } = req.params;

        const DynamicModel = await getDynamicModel(collectionName);

        if (!DynamicModel) {
            return res
                .status(400)
                .json({ error: 'Schema not found for this collection' });
        }

        const deletedDocument = await DynamicModel.findByIdAndDelete(id);

        if (!deletedDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json({ success: true, data: deletedDocument });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get all documents from a collection
router.get('/:collectionName', async (req, res) => {
    try {
        const { collectionName } = req.params;

        const DynamicModel = await getDynamicModel(collectionName);

        if (!DynamicModel) {
            return res
                .status(400)
                .json({ error: 'Schema not found for this collection' });
        }

        const documents = await DynamicModel.find();

        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get a document by ID from a collection
router.get('/:collectionName/:id', async (req, res) => {
    try {
        const { collectionName, id } = req.params;

        const DynamicModel = await getDynamicModel(collectionName);

        if (!DynamicModel) {
            return res
                .status(400)
                .json({ error: 'Schema not found for this collection' });
        }

        const document = await DynamicModel.findById(id);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json({ success: true, data: document });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Route to get a document by slug from a collection
router.get('/:collectionName/slug/:slug', async (req, res) => {
    try {
        const { collectionName, slug } = req.params;

        // Dynamically get the model for the specified collection
        const DynamicModel = await getDynamicModel(collectionName);

        if (!DynamicModel) {
            return res
                .status(400)
                .json({ error: 'Schema not found for this collection' });
        }

        // Search for a document where any slug field matches the provided slug
        const document = await DynamicModel.findOne({
            $or: [{ slugAz: slug }, { slugEn: slug }, { slugRu: slug }],
        });

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json({ success: true, data: document });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
