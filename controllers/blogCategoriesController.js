const express = require("express");
const BlogCategories = require("../models/blogCategoriesModel");
const slugify = require("slugify");

//create
exports.createBlogCategories = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const slug = slugify(categoryName, { lower: true });

    const existingCategory = await BlogCategories.findOne({ categoryName });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists." });
    }

    const category = new BlogCategories({ categoryName, slug });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//all categories
exports.getAll = async (req, res) => {
  try {
    const categories = await BlogCategories.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//single category by ID
exports.getbyId = async (req, res) => {
  try {
    const category = await BlogCategories.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found." });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update
exports.updateCategory = async (req, res) => {
  try {
    const categoryName = req.body.categoryName.toLowerCase();

    const existingCategory = await BlogCategories.findOne({ categoryName });
    if (existingCategory && existingCategory._id.toString() !== req.params.id) {
      return res.status(409).json({ message: "Category already exists." });
    }

    const category = await BlogCategories.findByIdAndUpdate(
      req.params.id,
      { categoryName },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete
exports.deleteCategory = async (req, res) => {
  try {
    const category = await BlogCategories.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    res
      .status(200)
      .json({ message: "Category deleted successfully.", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
