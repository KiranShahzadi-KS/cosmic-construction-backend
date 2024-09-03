const express = require("express");
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    designation: {
      type: String,
      required: [true, "designation is required"],
    },
    images: {
      type: String,
      required: true,
    },
    expertise: {
      type: String,
      required: [true, "expertise is required"],
    },
    experience: {
      type: String,
      required: [true, "experience is required"],
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
