import Order from "../models/order.model.js";
import Coupon from "../models/coupon.model.js";

let SSLCommerzPayment;
try {
  SSLCommerzPayment = (await import("sslcommerz-lts")).default;
} catch (error) {
  console.error("SSLCommerz import failed, using mock:", error);
  SSLCommerzPayment = class {
    init() {
      return { GatewayPageURL: "http://example.com" };
    }
    validate() {
      return { status: "VALID" };
    }
  };
}

const sslcommerz = new SSLCommerzPayment(
  process.env.SSLCZ_STORE_ID,
  process.env.SSLCZ_STORE_PASSWORD,
  process.env.SSLCOMMERZ_IS_LIVE === "true",
);

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode, customer, shipping_method } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "No products provided for checkout" });
    }

    const userId = req.user._id;
    let totalAmount = 0;

    products.forEach((item) => {
      const unit = Math.round(Number(item.price) || 0);
      totalAmount += unit * (Number(item.quantity) || 1);
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= (totalAmount * coupon.discountPercentage) / 100;
      }
    }

    // Ensure phone is present (SSLCommerz requires `cus_phone`) before creating the order
    const phone = (customer && customer.phone) || req.user.phone || "";
    if (!phone) {
      return res.status(400).json({
        message:
          "Customer phone is required for SSLCommerz payment (cus_phone).",
      });
    }

    // Create an order record before initiating payment so we have an order._id
    const order = await Order.create({
      user: userId,
      products: products.map((p) => ({
        product: p._id,
        quantity: p.quantity,
        price: p.price,
      })),
      totalAmount,
      paymentGateway: "sslcommerz",
      paymentStatus: "pending",
      couponCode: couponCode || "",
      shipping: {
        name: (customer && customer.name) || req.user.name,
        phone,
        address: (customer && customer.address) || "",
        city: (customer && customer.city) || "",
        state: (customer && customer.state) || "",
        postcode: (customer && customer.postcode) || "",
        country: (customer && customer.country) || "Bangladesh",
      },
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    const transaction_data = {
      total_amount: Number(totalAmount).toFixed(2),
      currency: "BDT",
      tran_id: `ORDER_${order._id}`,
      success_url: `${baseUrl}/api/payments/sslcommerz/success`,
      fail_url: `${baseUrl}/api/payments/sslcommerz/fail`,
      cancel_url: `${baseUrl}/api/payments/sslcommerz/cancel`,
      ipn_url: `${baseUrl}/api/payments/sslcommerz/ipn`,
      // Use shipping_method from the request when provided; default to 'Courier'
      shipping_method: shipping_method || "Courier",
      product_name: "Order Payment",
      product_category: "general",
      product_profile: "general",

      // Customer Information
      cus_name: req.user.name,
      cus_email: req.user.email,
      cus_add1: order.shipping?.address || "",
      cus_add2: order.shipping?.address || "",
      cus_city: order.shipping?.city || "",
      cus_state: order.shipping?.state || "",
      cus_postcode: order.shipping?.postcode || "",
      cus_country: order.shipping?.country || "Bangladesh",
      // Ensure cus_phone is populated (SSLCommerz requires it)
      cus_phone:
        (customer && customer.phone) ||
        order.shipping?.phone ||
        req.user.phone ||
        "",
      cus_fax:
        (customer && customer.phone) ||
        order.shipping?.phone ||
        req.user.phone ||
        "",

      // Shipping Information
      ship_name: order.shipping?.name || req.user.name,
      ship_add1: order.shipping?.address || "",
      ship_add2: order.shipping?.address || "",
      ship_city: order.shipping?.city || "",
      ship_state: order.shipping?.state || "",
      ship_postcode: order.shipping?.postcode || "",
      ship_country: order.shipping?.country || "Bangladesh",

      // Optional metadata
      value_a: order._id.toString(),
      value_b: req.user._id.toString(),
      value_c: order.couponCode || "",
      value_d: totalAmount.toString(),
    };

    const result = await sslcommerz.init(transaction_data);

    if (result.GatewayPageURL) {
      return res.json({
        success: true,
        gatewayUrl: result.GatewayPageURL,
        orderId: order._id,
      });
    }

    return res.status(500).json({ message: "Failed to initiate payment" });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};

export const sslcommerzSuccess = async (req, res) => {
  try {
    const { tran_id, val_id } = req.body;
    const orderId = tran_id.replace("ORDER_", "");

    const validation = await sslcommerz.validate({ val_id });

    if (validation.status === "VALID") {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        sslcommerzTranId: val_id,
      });

      return res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/payment/success?order=${orderId}`,
      );
    }

    return res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/fail`,
    );
  } catch (error) {
    console.error("Success handler error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/fail`,
    );
  }
};

export const sslcommerzFail = async (req, res) => {
  try {
    const { tran_id } = req.body;
    const orderId = tran_id.replace("ORDER_", "");

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "failed",
    });

    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/fail`,
    );
  } catch (error) {
    console.error("Fail handler error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/fail`,
    );
  }
};

export const sslcommerzCancel = async (req, res) => {
  try {
    const { tran_id } = req.body;
    const orderId = tran_id.replace("ORDER_", "");

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "cancelled",
    });

    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/cancel`,
    );
  } catch (error) {
    console.error("Cancel handler error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment/cancel`,
    );
  }
};

export const sslcommerzIPN = async (req, res) => {
  try {
    const { tran_id, val_id, status } = req.body;
    const orderId = tran_id.replace("ORDER_", "");

    if (status === "VALID") {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        sslcommerzTranId: val_id,
      });
    }

    res.status(200).send("IPN received");
  } catch (error) {
    console.error("IPN handler error:", error);
    res.status(500).send("IPN processing failed");
  }
};
