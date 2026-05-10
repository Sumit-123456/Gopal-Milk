const express = require("express");
const router = express.Router();

const {
  getProducts,
  getFeaturedProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/*
==========================================
PUBLIC ROUTES
==========================================
*/

router.get("/", getProducts);

router.get("/featured", getFeaturedProducts);

router.get("/:id", getSingleProduct);

/*
==========================================
ADMIN ROUTES
==========================================
*/

router.post("/add", protect, adminOnly, addProduct);

router.put("/update/:id", protect, adminOnly, updateProduct);

router.delete("/delete/:id", protect, adminOnly, deleteProduct);

module.exports = router;
