const express = require("express");
const {
  createAttribute,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
  getAllAttributes,
} = require("../controllers/attributesController");

const router = express.Router();

router.post("/", createAttribute);
router.get("/", getAllAttributes);
router.get("/:id", getAttributeById);
router.post("/:id", updateAttribute);
router.delete("/:id", deleteAttribute);

module.exports = router;
