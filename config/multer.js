const multer = require('multer');

// Configure storage for the uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to store files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    },
});

// File filter for specific formats
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/jpg'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only PDF, DOCX, Word, PNG, JPG, and JPEG are allowed.'));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
