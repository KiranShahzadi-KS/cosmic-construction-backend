const { required } = require("joi");
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email must be unique."],
    },
    phoneNumber: { type: String, required: [true, "Contact is required."] },
    saySomething: {
      type: String,
    },
    portfolioLink: {
      type: String,
    },
    cv: {
      type: String,
      required: [true, "CV is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ApplicationForm", applicationSchema);
