const mongoose = require("mongoose");

const serviceCategoriesSchema = new mongoose.Schema(
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

module.exports = mongoose.model("ServicesCategories", serviceCategoriesSchema);
