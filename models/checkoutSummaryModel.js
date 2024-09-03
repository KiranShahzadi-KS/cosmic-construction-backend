const mongoose = require("mongoose");

const CheckoutSummarySchema = new mongoose.Schema(
  {
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    shipping: {
      type: Number,
      required: true,
      default: 0.0,
    },
    conversionRate: {
      type: Number,
      required: true,
      default: 1,
    },
    percentageCharge: {
      type: Number,
      required: true,
      default: 0,
    },
    fixedCharge: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CheckoutSummary", CheckoutSummarySchema);
