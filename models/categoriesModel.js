const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      trim: true,
      required: [true, "Category is required."],
    },
    slug: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categories", categoriesSchema);
