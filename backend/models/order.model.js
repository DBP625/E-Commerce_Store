import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: false,
    },

    discountAmount: Number,
    couponCode: String,
    totalAmount: Number,
    shipping: {
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      postcode: String,
      country: String,
    },
    sslcommerzSessionId: { type: String, unique: true, sparse: true }, // session/val_id or store_tran_id
    sslcommerzTranId: { type: String, sparse: true }, // transaction id returned after success
    paymentGateway: {
      type: String,
      enum: ["stripe", "sslcommerz"],
      default: "sslcommerz",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
