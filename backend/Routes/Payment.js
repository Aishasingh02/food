const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Orders = require("../models/Orders");

// Check if Razorpay keys are properly configured
const areKeysConfigured = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  return (
    key_id &&
    key_secret &&
    key_id !== "rzp_test_YourKeyIdHere" &&
    key_secret !== "YourKeySecretHere"
  );
};

// Initialize Razorpay Instance
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!areKeysConfigured()) {
    console.warn("⚠️ Warning: Razorpay API keys are not set in .env. Please update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }

  return new Razorpay({
    key_id: key_id || "rzp_test_YourKeyIdHere",
    key_secret: key_secret || "YourKeySecretHere",
  });
};

// 1. Get Razorpay Public Key ID
router.get("/getkey", (req, res) => {
  try {
    const key = process.env.RAZORPAY_KEY_ID || "";
    const isConfigured = areKeysConfigured();

    res.status(200).json({
      success: true,
      key: key,
      isConfigured: isConfigured,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Create Razorpay Order
router.post("/checkout", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    if (!areKeysConfigured()) {
      return res.status(400).json({
        success: false,
        message: "Razorpay API keys are not configured in backend/.env. Please add your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET from dashboard.razorpay.com.",
      });
    }

    const instance = getRazorpayInstance();

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    
    let errorMsg = error.message;
    if (error.statusCode === 401 || (error.error && error.error.code === "BAD_REQUEST_ERROR")) {
      errorMsg = "Razorpay Authentication Failed: Invalid Key ID or Secret in backend/.env.";
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: errorMsg,
      error: error.error || error.message,
    });
  }
});

// 3. Verify Payment Signature and Save Order
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      order_data,
      order_date,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters",
      });
    }

    if (!email || !order_data || !Array.isArray(order_data) || order_data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or order data",
      });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET || "YourKeySecretHere";

    // HMAC SHA256 Signature Verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature!",
      });
    }

    // Payment signature is verified, now save order in MongoDB
    let data = [...order_data];
    data.unshift({
      Order_date: order_date || new Date().toDateString(),
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      payment_status: "Paid",
      payment_method: "Razorpay",
    });

    let existingOrder = await Orders.findOne({ email });

    if (existingOrder) {
      await Orders.findOneAndUpdate(
        { email },
        {
          $push: {
            order_data: { $each: data },
          },
        }
      );
    } else {
      await Orders.create({
        email: email,
        order_data: data,
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully!",
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during payment verification",
      error: error.message,
    });
  }
});

module.exports = router;
