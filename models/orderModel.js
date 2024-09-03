const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          // required: true,
        },
        quantity: {
          type: Number,
          // required: true,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },

    //for shipping
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    contact: {
      type: Number,
    },
    Country: {
      type: String,
    },

    StreetAddress: {
      type: String,
    },
    townCity: {
      type: String,
    },
    Postcode: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },

    //cart det
    total: {
      type: String,
    },
    cartItems: {
      type: String,
    },

    cartTotal: {
      type: String,
    },

    paymentMethod: {
      type: String,
    },

    shippingCost: {
      type: String,
    },

    totalItems: {
      type: String,
    },
    orderNo: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
