const Testimonial = require("../models/testimonialModel");

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, role, message } = req.body;
    const imageUrl = req.file ? req.file.path : "";
    const testimonial = new Testimonial({ name, role, message, imageUrl });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, message } = req.body;
    const imageUrl = req.file ? req.file.path : "";
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { name, role, message, imageUrl },
      { new: true }
    );
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await Testimonial.findByIdAndDelete(id);
    res.json({ message: "Testimonial deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
