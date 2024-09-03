const express = require("express");
const Attributes = require("../models/attributesModel");
const slugify = require("slugify");

//create
exports.createAttribute = async (req, res) => {
  try {
    const { attributeName } = req.body;

    if (!attributeName) {
      return res.status(400).json({ message: "Attribute name is required." });
    }

    const slug = slugify(attributeName, { lower: true });

    const existingAttributes = await Attributes.findOne({
      attributeName,
    });
    if (existingAttributes) {
      return res.status(409).json({ message: "Attribute already exists." });
    }

    const attribute = new Attributes({ attributeName, slug });
    await attribute.save();

    res.status(201).json(attribute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get all
exports.getAllAttributes = async (req, res) => {
  try {
    const attributes = await Attributes.find();
    // .populate({ path: "colorId", select: "colorName" })
    // .populate({ path: "categoriesId", select: "categoryName" });
    res.status(200).json(attributes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get by id
exports.getAttributeById = async (req, res) => {
  try {
    const attribute = await Attributes.findById(req.params.id);
    // .populate({ path: "colorId", select: "colorName" })
    // .populate({ path: "categoriesId", select: "categoryName" });
    if (!attribute) {
      return res.status(404).json({ message: "Attribute not found." });
    }
    res.status(200).json(attribute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update
exports.updateAttribute = async (req, res) => {
  try {
    const { attributeName } = req.body;

    // Validate that attributeName is provided
    if (!attributeName || attributeName.trim() === "") {
      return res.status(400).json({ message: "Attribute name is required." });
    }

    const slug = slugify(attributeName, { lower: true });

    // Find and update the attribute
    const attribute = await Attributes.findByIdAndUpdate(
      req.params.id,
      { attributeName, slug },
      { new: true, runValidators: true }
    );

    // Check if the attribute exists
    if (!attribute) {
      return res.status(404).json({ message: "Attribute not found." });
    }

    res
      .status(200)
      .json({ message: "Attribute updated successfully.", attribute });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Delete
exports.deleteAttribute = async (req, res) => {
  try {
    const attribute = await Attributes.findByIdAndDelete(req.params.id);
    if (!attribute) {
      return res.status(404).json({ message: "Attribute not found." });
    }
    res
      .status(200)
      .json({ message: "Attribute deleted successfully.", attribute });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
