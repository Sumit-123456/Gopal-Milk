const Order = require("../models/Order");

/*
==========================================
CREATE ORDER
==========================================
*/

exports.createOrder = async (req, res) => {
  try {
    const {
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentDetails,
    } = req.body;

    const order = await Order.create({
      userId: req.user.id,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentDetails,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Order creation failed",
    });
  }
};

/*
==========================================
GET USER ORDERS
==========================================
*/

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).populate("products.productId");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user orders",
    });
  }
};

/*
==========================================
GET ALL ORDERS (ADMIN)
==========================================
*/

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email phone address city state pincode")
      .populate("products.productId", "name price image category")
      .sort({
        createdAt: -1,
      });

    /*
        ==========================================
        SUCCESS RESPONSE
        ==========================================
        */

    res.status(200).json(orders);
  } catch (error) {
    console.log("Get all orders error:", error);

    res.status(500).json({
      message: "Failed to fetch all orders",
    });
  }
};

/*
==========================================
UPDATE ORDER STATUS
==========================================
*/

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus: req.body.orderStatus,
      },
      {
        new: true,
      },
    );

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order",
    });
  }
};
