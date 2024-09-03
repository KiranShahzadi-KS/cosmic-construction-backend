const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      trim: true,
      required: [true, "Service Name is required."],
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    image: {
      type: String,
      required: false, // Single image field
    },
    iconImage: {
      type: String,
      required: false, // Icon image field
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicesCategories",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Services", servicesSchema);
