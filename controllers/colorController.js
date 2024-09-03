const express = require("express");
const Color = require("../models/colorModel");
const slugify = require("slugify");

//Create
exports.createColor = async (req, res) => {
  try {
    const { colorName, hex } = req.body;

    if (!colorName) {
      return res.status(400).json({ message: "Color name is required." });
    }

    const slug = slugify(colorName, { lower: true });

    const existingColor = await Color.findOne({ colorName });
    if (existingColor) {
      return res.status(409).json({ message: "Color already exists." });
    }

    const color = new Color({
      colorName,
      hex,
      slug,
    });
    await color.save();

    res.status(201).json(color);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get all
exports.getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get by id
exports.getColorById = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ message: "Color not found." });
    }
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update
exports.updateColor = async (req, res) => {
  try {
    const { colorName, hex } = req.body;

    if (!colorName) {
      return res.status(400).json({ message: "Colour name is required." });
    }

    // Convert colorName and hex to lowercase
    const slug = slugify(colorName, { lower: true });

    const existingColor = await Color.findOne({ colorName });
    if (existingColor && existingColor._id.toString() !== req.params.id) {
      return res.status(409).json({ message: "Color already exists." });
    }

    const color = await Color.findByIdAndUpdate(
      req.params.id,
      { colorName, hex, slug },
      { new: true, runValidators: true }
    );

    if (!color) {
      return res.status(404).json({ message: "Color not found." });
    }

    res.status(200).json(color);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete
exports.deleteColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndDelete(req.params.id);
    if (!color) {
      return res.status(404).json({ message: "Color not found." });
    }
    res.status(200).json({ message: "Color deleted successfully.", color });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
