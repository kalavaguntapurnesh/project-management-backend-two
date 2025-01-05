const LeaseFile = require('../models/uploadLeaseAgreement.model');

exports.uploadLeaseAgreement = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const leaseFile = {
            filename: req.file.filename,
            fileType: req.file.mimetype,
            filePath: req.file.path,
        };

        const newFile = new LeaseFile(leaseFile);
        await newFile.save();

        res.status(201).json({ message: 'File uploaded successfully', data: newFile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
};

exports.getLeaseFiles = async (req, res) => {
    try {
      const leaseFiles = await LeaseFile.find(); // Fetch all files from the database
      res.status(200).json({ success: true, data: leaseFiles });
    } catch (error) {
      console.error('Error fetching lease files:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch lease files' });
    }
  };
