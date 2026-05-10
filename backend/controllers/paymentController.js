const razorpay = require("../config/razorpay");

/*
==========================================
CREATE RAZORPAY ORDER
==========================================
*/

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    /*
        ==========================================
        VALIDATE AMOUNT
        ==========================================
        */

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid payment amount",
      });
    }

    /*
        ==========================================
        CREATE ORDER
        ==========================================
        */

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("Razorpay order creation error:", error);

    res.status(500).json({
      message: "Failed to create Razorpay order",
    });
  }
};

const crypto = require("crypto");

/*
==========================================
VERIFY RAZORPAY PAYMENT
==========================================
*/

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    /*
        ==========================================
        GENERATE EXPECTED SIGNATURE
        ==========================================
        */

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    /*
        ==========================================
        VERIFY
        ==========================================
        */

    if (generatedSignature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.log("Payment verification error:", error);

    res.status(500).json({
      success: false,
      message: "Server verification failed",
    });
  }
};
