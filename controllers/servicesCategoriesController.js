const ServicesCategories = require("../models/servicesCategoryModel");
const slugify = require("slugify");

// Create category
exports.createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const slug = slugify(categoryName, { lower: true });

    const existingCategory = await ServicesCategories.findOne({ slug });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists." });
    }

    const newCategory = new ServicesCategories({
      categoryName,
      slug,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await ServicesCategories.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get  category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await ServicesCategories.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update
exports.updateCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const slug = slugify(categoryName, { lower: true });

    const updatedCategory = await ServicesCategories.findByIdAndUpdate(
      req.params.id,
      { categoryName, slug },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
exports.deleteCategory = async (req, res) => {
  try {
    const category = await ServicesCategories.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
