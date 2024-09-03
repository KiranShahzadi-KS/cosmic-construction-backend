const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/servicesController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/services/");
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

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "iconImage", maxCount: 1 },
  ]),
  createService
);

router.get("/", getAllServices);

router.get("/:id", getServiceById);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "iconImage", maxCount: 1 },
  ]),
  updateService
);

router.delete("/:id", deleteService);

module.exports = router;
