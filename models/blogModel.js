const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    blogName: {
      type: String,
      trim: true,
      required: [true, "Blog Name is required."],
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    images: {
      type: [String],
      required: false,
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "BlogCategories" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
