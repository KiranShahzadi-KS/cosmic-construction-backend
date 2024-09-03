const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email must be unique."],
    },
    phone: {
      type: String,
      required: [true, "Phone is required."],
    },
    subject: {
      type: String,
      trim: true,
      required: [true, "Subject is required."],
    },
    message: {
      type: String,
      trim: true,
      required: [true, "Message is required."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactUsSchema);
