const Service = require("../models/servicesModel");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");

// Create Service
exports.createService = async (req, res) => {
  try {
    const { serviceName, description, categoryId } = req.body;

    // Generate URLs for the uploaded images
    const imageUrl = req.files["image"]
      ? `uploads/services/${req.files["image"][0].filename}`
      : null;
    const iconImageUrl = req.files["iconImage"]
      ? `uploads/services/${req.files["iconImage"][0].filename}`
      : null;

    // Create a slug from the service name
    const slug = slugify(serviceName, { lower: true });

    // Create a new service entry
    const service = new Service({
      serviceName,
      slug,
      description,
      image: imageUrl,
      iconImage: iconImageUrl,
      categoryId,
    });

    // Save the service to the database
    await service.save();

    // Respond with the created service
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate({
      path: "categoryId",
      select: "categoryName -_id",
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate({
      path: "categoryId",
      select: "categoryName -_id",
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Service
exports.updateService = async (req, res) => {
  try {
    const { serviceName, description, categoryId } = req.body;

    // Handle image updates
    const imageUrl = req.files["image"]
      ? `uploads/services/${req.files["image"][0].filename}`
      : undefined;
    const iconImageUrl = req.files["iconImage"]
      ? `uploads/services/${req.files["iconImage"][0].filename}`
      : undefined;

    const slug = slugify(serviceName, { lower: true });

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        serviceName,
        slug,
        description,
        image: imageUrl,
        iconImage: iconImageUrl,
        categoryId,
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    // Remove images from filesystem
    if (service.image) {
      const imagePath = path.join(
        __dirname,
        "../uploads/services",
        path.basename(service.image)
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    if (service.iconImage) {
      const iconImagePath = path.join(
        __dirname,
        "../uploads/services",
        path.basename(service.iconImage)
      );
      if (fs.existsSync(iconImagePath)) {
        fs.unlinkSync(iconImagePath);
      }
    }

    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Service deleted successfully.", service });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
