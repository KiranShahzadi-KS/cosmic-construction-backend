const multer = require("multer");
const path = require("path");

const cvStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/cvs");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Set up multer to accept only PDF files
const uploadCv = multer({
  storage: cvStorage,
  fileFilter: function (req, file, cb) {
    const fileTypes = /pdf/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = {
  uploadCv,
};
