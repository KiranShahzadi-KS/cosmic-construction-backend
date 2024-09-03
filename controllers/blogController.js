const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const BlogCategories = require("../models/blogCategoriesModel");
const slugify = require("slugify");

//create blog
exports.createBlog = async (req, res) => {
  const { blogName, description, categoryId, userId } = req.body;

  try {
    // Find the user by their ID (assumed to be stored in req.userId from authentication middleware)
    const user = await User.findById(userId);

    console.log("user data =========", user);

    // Check if the user is an admin
    if (user.role !== "admin" && user.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can create blogs." });
    }

    const images = req.files.map((file) => file.path);

    const slug = slugify(blogName, { lower: true });

    const blog = new Blog({
      blogName,
      slug,
      description,
      images: images,
      categoryId,
      userId,
    });

    await blog.save();

    // Push the blog ID to the corresponding category's blogs array
    await BlogCategories.findByIdAndUpdate(
      categoryId,
      { $push: { blogs: blog._id } }, // Push the blog ID to the 'blogs' array in the category
      { new: true, useFindAndModify: false }
    );

    // Push the blog ID to the user's blogs array
    await User.findByIdAndUpdate(
      req.userId,
      { $push: { blogs: blog._id } }, // Push the blog ID to the 'blogs' array in the user
      { new: true, useFindAndModify: false }
    );

    res.status(201).json({ message: "Blog created successfully.", blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// get all blogs
exports.getAllBlogs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const blogs = await Blog.find()
      .populate("categoryId", "categoryName")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Blog.countDocuments();

    res.status(200).json({
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// get by id
exports.getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id).populate("categoryId", "categoryName");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//update blog
exports.updateBlog = [
  async (req, res) => {
    const { id } = req.params;
    const { blogName, description, images, categoryId } = req.body;

    try {
      // Find the existing blog
      const blog = await Blog.findById(id);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found." });
      }

      // Check if categoryId is being updated
      const previousCategoryId = blog.categoryId;

      // Update the blog with new data
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { blogName, description, images, categoryId },
        { new: true, runValidators: true }
      );

      if (!updatedBlog) {
        return res.status(404).json({ message: "Failed to update the blog." });
      }

      // If the categoryId has changed, update the categories
      if (categoryId !== previousCategoryId.toString()) {
        // Remove the blog ID from the previous category
        await BlogCategories.findByIdAndUpdate(
          previousCategoryId,
          { $pull: { blogs: blog._id } },
          { new: true }
        );

        // Add the blog ID to the new category
        await BlogCategories.findByIdAndUpdate(
          categoryId,
          { $push: { blogs: blog._id } },
          { new: true }
        );
      }

      res.status(200).json({
        message: "Blog updated successfully.",
        updatedBlog,
      });
    } catch (error) {
      console.error("Error updating blog:", error);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },
];

//delete
exports.deleteBlog = [
  async (req, res) => {
    const { id } = req.params;

    try {
      // Find the blog by ID
      const blog = await Blog.findById(id);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found." });
      }

      // Get the categoryId associated with the blog
      const categoryId = blog.categoryId;

      // Delete the blog
      await Blog.findByIdAndDelete(id);

      // Remove the blog ID from the associated category
      await BlogCategories.findByIdAndUpdate(
        categoryId,
        { $pull: { blogs: id } },
        { new: true }
      );

      res.status(200).json({ message: "Blog deleted successfully.", blog });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },
];
