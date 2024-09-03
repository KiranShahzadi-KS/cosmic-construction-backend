const express = require("express");
const {
  createBlogCategories,
  getAll,
  getbyId,
  updateCategory,
  deleteCategory,
} = require("../controllers/blogCategoriesController");

const router = express.Router();

router.post("/create", createBlogCategories);
router.get("/", getAll);
router.get("/:id", getbyId);
router.post("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;
