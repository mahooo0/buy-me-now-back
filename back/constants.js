const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Define the upload folder path
const uploadFolder = path.join(__dirname, 'uploads');

// Ensure the upload folder exists
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
    console.log('Upload folder created:', uploadFolder);
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${uniqueSuffix}${extension}`);
    },
});

// Initialize multer
const upload = multer({
    storage,
});

module.exports = upload;
