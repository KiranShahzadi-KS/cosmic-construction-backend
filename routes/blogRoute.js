const express = require("express");
const {
  createBlog,
  getBlogById,
  getAllBlogs,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const upload = require("../config/multer");

const router = express.Router();

router.post("/", upload.array("images", 5), createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
