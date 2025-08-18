const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/receipts');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
// Storage configuration for reciepts images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/receipts'); // save in /public/uploads/reciepts
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // unique name + original extension
    }
});

const upload = multer({ storage });

module.exports = upload;