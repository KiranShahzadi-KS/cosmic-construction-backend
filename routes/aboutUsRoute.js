const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createAboutUs,
  getAllAboutUs,
  getAboutUsById,
  updateAboutUs,
} = require("../controllers/aboutUsController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/aboutUs/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
});
router.post("/", upload.single("image"), createAboutUs);

router.get("/", getAllAboutUs);

router.get("/:id", getAboutUsById);

router.post("/:id", upload.single("image"), updateAboutUs);

module.exports = router;
