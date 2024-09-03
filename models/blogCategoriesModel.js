const mongoose = require("mongoose");

const blogCategoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      trim: true,
      required: [true, "Category is required."],
    },
    slug: {
      type: String,
    },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogCategories", blogCategoriesSchema);
