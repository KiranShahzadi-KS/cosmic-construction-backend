const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
  colorName: {
    type: String,
    required: [true, "Color is required"],
  },
  hex: {
    type: String,
    required: [true, "Hex value is required"],
  },
  slug: {
    type: String,
  },
});

module.exports = mongoose.model("Color", colorSchema);
