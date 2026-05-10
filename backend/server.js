// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const helmet = require("helmet");
// const compression = require("compression");
// const morgan = require("morgan");
// const productRoutes = require("./routes/productRoutes");

// dotenv.config();

// const app = express();

// /*
// ===================================
// MIDDLEWARE
// ===================================
// */

// app.use(express.json());
// app.use(cors());
// app.use(helmet());
// app.use(compression());
// app.use(morgan("dev"));

// /*
// ===================================
// DATABASE CONNECTION
// ===================================
// */

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected Successfully");
//   })
//   .catch((error) => {
//     console.log("Database Connection Error:", error);
//   });

// /*
// ===================================
// TEST ROUTE
// ===================================
// */

// app.get("/", (req, res) => {
//   res.json({
//     message: "Dairy Ecommerce Backend Running Successfully",
//   });
// });
// app.use("/api/products", productRoutes);
// /*
// ===================================
// SERVER LISTEN
// ===================================
// */

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

/*
==========================================
LOAD ENV VARIABLES FIRST
==========================================
*/

dotenv.config();

/*
==========================================
DEBUG ENV (REMOVE LATER IF NEEDED)
==========================================
*/

console.log(
  "RAZORPAY_KEY_ID:",
  process.env.RAZORPAY_KEY_ID ? "Loaded" : "Missing",
);
console.log(
  "RAZORPAY_KEY_SECRET:",
  process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Missing",
);

/*
==========================================
IMPORT ROUTES AFTER ENV LOAD
==========================================
*/

const paymentRoutes = require("./routes/paymentRoutes");
const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

/*
==========================================
CONNECT DATABASE
==========================================
*/

connectDB();

const app = express();

/*
==========================================
MIDDLEWARE
==========================================
*/

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

/*
==========================================
BASE ROUTE
==========================================
*/

app.get("/", (req, res) => {
  res.json({
    message: "Dairy Ecommerce Backend Running Successfully",
  });
});

/*
==========================================
API ROUTES
==========================================
*/

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);

/*
==========================================
SERVER START
==========================================
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
