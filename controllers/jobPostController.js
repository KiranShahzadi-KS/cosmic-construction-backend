const express = require("express");
const JobPost = require("../models/jobPostModel");

// Create JobPost
exports.createJob = async (req, res) => {
  try {
    const jobPost = new JobPost(req.body);
    await jobPost.save();
    res.status(201).json(jobPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All JobPosts
exports.getAll = async (req, res) => {
  try {
    const jobPosts = await JobPost.find()
      .populate("categoryId", "categoryName")
      .populate("applications");

    res.json(jobPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single JobPost by ID
exports.getById = async (req, res) => {
  try {
    const jobPost = await JobPost.findById(req.params.id)
      .populate("categoryId", "categoryName")
      .populate("applications");
    if (!jobPost) {
      return res.status(404).json({ message: "JobPost not found" });
    }
    res.json(jobPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update JobPost by ID
exports.updateJob = async (req, res) => {
  try {
    const jobPost = await JobPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!jobPost) {
      return res.status(404).json({ message: "JobPost not found" });
    }
    res.json(jobPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete JobPost by ID
exports.deleteJob = async (req, res) => {
  try {
    const jobPost = await JobPost.findByIdAndDelete(req.params.id);
    if (!jobPost) {
      return res.status(404).json({ message: "JobPost not found" });
    }
    res.json({ message: "JobPost deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//// Get JobPosts by Category ID
exports.getJobsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find job posts that match the category ID
    const jobPosts = await JobPost.find({ categoryId })
      .populate("categoryId", "categoryName")
      .select("-applications");

    if (jobPosts.length === 0) {
      return res
        .status(404)
        .json({ message: "No job posts found for this category." });
    }

    res.status(200).json(jobPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
