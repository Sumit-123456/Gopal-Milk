const express = require("express");
const router = express.Router();

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

/*
==========================================
CREATE PAYMENT ORDER
==========================================
*/

router.post("/create-order", protect, createRazorpayOrder);

/*
==========================================
VERIFY PAYMENT
==========================================
*/

router.post("/verify-payment", protect, verifyRazorpayPayment);

module.exports = router;
