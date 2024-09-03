const express = require("express");
const Review = require("../models/reviewModel");
const productModel = require("../models/productModel");

// create
exports.createReview = async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log("Product ID:", productId);
    const { userId, rating, ratingText } = req.body;
    console.log("reqest body ==========", req.body);
    const product = await productModel.findById(productId);
    console.log("productsssssssss", product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = new Review({
      userId,
      rating,
      ratingText,
    });

    await review.save();

    product.reviews.push(review._id);
    await product.save();

    res.status(201).json({ message: "Review created successfully.", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "username")
      .populate("productId", "productName");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get by id
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId", "username")
      .populate("productId", "productName");

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update
exports.updateReview = async (req, res) => {
  try {
    const { rating, ratingText } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, ratingText },
      { new: true, runValidators: true }
    )
      .populate("userId", "username")
      .populate("productId", "productName");

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    res.status(200).json({ message: "Review updated successfully.", review });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
