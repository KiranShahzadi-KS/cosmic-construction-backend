const express = require("express");
const {
  createCategories,
  getAll,
  getbyId,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoriesController");

const router = express.Router();

router.post("/create", createCategories);
router.get("/", getAll);
router.get("/:id", getbyId);
router.post("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;
