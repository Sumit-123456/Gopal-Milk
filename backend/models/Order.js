const mongoose = require("mongoose");

/*
==========================================
ORDER SCHEMA
==========================================
*/

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    shippingAddress: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Online", "Razorpay"],
      default: "COD",
    },

    /*
        ==========================================
        PAYMENT DETAILS
        ==========================================
        */

    paymentDetails: {
      razorpayOrderId: {
        type: String,
        default: null,
      },

      razorpayPaymentId: {
        type: String,
        default: null,
      },
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
