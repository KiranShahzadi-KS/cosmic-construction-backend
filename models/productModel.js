const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      trim: true,
      required: [true, "Product Name is required."],
    },
    slug: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required."],
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
    description: {
      type: String,
      required: [true, "Description is required."],
    },

    isAvailable: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
    sku: {
      type: String,
      required: [true, "Description is required."],
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    New: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Categories" },
    isLike: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    colorId: { type: mongoose.Schema.Types.ObjectId, ref: "Color" },
    attributesId: { type: mongoose.Schema.Types.ObjectId, ref: "Attributes" },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
