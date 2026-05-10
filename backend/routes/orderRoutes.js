const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/*
==========================================
CREATE ORDER
==========================================
*/

router.post("/create", protect, createOrder);

/*
==========================================
USER ORDERS
==========================================
*/

router.get("/my-orders", protect, getUserOrders);

/*
==========================================
ADMIN ALL ORDERS
==========================================
*/

router.get("/all-orders", protect, adminOnly, getAllOrders);

/*
==========================================
UPDATE ORDER STATUS
==========================================
*/

router.put("/update-status/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;
