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
    const { products, couponCode } = req.body;

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
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    const transaction_data = {
      total_amount: totalAmount.toFixed(2),
      currency: "BDT",
      tran_id: `ORDER_${order._id}`,
      success_url: `${baseUrl}/api/payments/sslcommerz/success`,
      fail_url: `${baseUrl}/api/payments/sslcommerz/fail`,
      cancel_url: `${baseUrl}/api/payments/sslcommerz/cancel`,
      ipn_url: `${baseUrl}/api/payments/sslcommerz/ipn`,
      shipping_method: "Courier",
      product_name: "Order Payment",
      product_category: "Electronic",
      product_profile: "general",
      cus_name: req.user.name,
      cus_email: req.user.email,
      cus_add1: req.body.customer?.address || "",
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
      multi_card_name: "mastercard",
      value_a: "ref001_A",
      value_b: "ref002_B",
      value_c: "ref003_C",
      value_d: "ref004_D",
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
