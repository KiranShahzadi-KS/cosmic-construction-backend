const express = require("express");
const {
  createApplicationForm,
  getAll,
  getById,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationFormController");

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

const router = express.Router();

router.post("/job/:id/apply", uploadCv.single("cv"), createApplicationForm);
router.get("/", getAll);
router.get("/:id", getById);
router.post("/:id", uploadCv.single("cv"), updateApplication);
router.delete("/:id", deleteApplication);

module.exports = router;
