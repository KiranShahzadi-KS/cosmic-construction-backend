const AboutUs = require("../models/aboutUsModel");

// Create a new About Us entry
exports.createAboutUs = async (req, res) => {
  try {
    const { title, description } = req.body;

    const image = req.file ? req.file.path : null;

    const newAboutUs = new AboutUs({
      title,
      description,
      images: image,
    });

    await newAboutUs.save();

    res.status(201).json({
      message: "About Us entry created successfully.",
      data: newAboutUs,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All About
exports.getAllAboutUs = async (req, res) => {
  try {
    const aboutUsEntries = await AboutUs.find();

    res.status(200).json({
      message: "About Us entries retrieved successfully.",
      data: aboutUsEntries,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single About Us entry by ID
exports.getAboutUsById = async (req, res) => {
  try {
    const aboutUsEntry = await AboutUs.findById(req.params.id);

    if (!aboutUsEntry) {
      return res.status(404).json({ message: "About Us entry not found." });
    }

    res.status(200).json({
      message: "About Us entry retrieved successfully.",
      data: aboutUsEntry,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an About Us entry by ID
exports.updateAboutUs = async (req, res) => {
  try {
    const { title, description } = req.body;

    const image = req.file ? req.file.path : undefined;

    const updatedData = {
      title,
      description,
    };

    if (image) {
      updatedData.images = image;
    }

    const updatedAboutUs = await AboutUs.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedAboutUs) {
      return res.status(404).json({ message: "About Us entry not found." });
    }

    res.status(200).json({
      message: "About Us entry updated successfully.",
      data: updatedAboutUs,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
