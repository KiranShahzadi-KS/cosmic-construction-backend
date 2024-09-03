const express = require("express");
const {
  createColor,
  updateColor,
  deleteColor,
  getAllColors,
  getColorById,
} = require("../controllers/colorController");

const router = express.Router();

router.post("/", createColor);
router.get("/", getAllColors);
router.get("/:id", getColorById);
router.post("/update/:id", updateColor);
router.delete("/delete/:id", deleteColor);

module.exports = router;
