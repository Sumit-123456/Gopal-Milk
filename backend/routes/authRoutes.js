const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  adminLogin,
} = require("../controllers/authController");

/*
==========================================
USER REGISTER
==========================================
*/

router.post("/register", registerUser);

/*
==========================================
USER LOGIN
==========================================
*/

router.post("/login", loginUser);

/*
==========================================
ADMIN LOGIN
==========================================
*/

router.post("/admin/login", adminLogin);

module.exports = router;
