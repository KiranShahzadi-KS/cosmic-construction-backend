const express = require("express");
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.post("/addreview/:productId", createReview);
router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.post("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
