const mongoose = require('mongoose');

const leaseFileSchema = new mongoose.Schema(
    {
        filename: { type: String, required: true },
        fileType: { type: String, required: true },
        filePath: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('LeaseFile', leaseFileSchema);
