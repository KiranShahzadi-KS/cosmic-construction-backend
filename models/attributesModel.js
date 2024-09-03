const mongoose = require("mongoose");

const attributesSchema = new mongoose.Schema(
  {
    attributeName: {
      type: String,
      trim: true,
      required: [true, "Attribute Name is required."],
    },
    slug: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attributes", attributesSchema);
