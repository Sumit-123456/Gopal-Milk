const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
==========================================
GENERATE JWT TOKEN
==========================================
*/

const generateToken = (userId, role = "user") => {
  return jwt.sign(
    {
      id: userId,
      role: role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );
};

/*
==========================================
REGISTER USER
==========================================
*/

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /*
        ==========================================
        VALIDATION
        ==========================================
        */

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    /*
        ==========================================
        CHECK EXISTING USER
        ==========================================
        */

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    /*
        ==========================================
        HASH PASSWORD
        ==========================================
        */

    const hashedPassword = await bcrypt.hash(password, 10);

    /*
        ==========================================
        CREATE USER
        ==========================================
        */

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    /*
        ==========================================
        SUCCESS
        ==========================================
        */

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Registration Error:", error);

    res.status(500).json({
      message: "Server error during registration",
    });
  }
};

/*
==========================================
LOGIN USER
==========================================
*/

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    /*
        ==========================================
        VALIDATION
        ==========================================
        */

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    /*
        ==========================================
        FIND USER
        ==========================================
        */

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    /*
        ==========================================
        PASSWORD CHECK
        ==========================================
        */

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    /*
        ==========================================
        TOKEN
        ==========================================
        */

    const token = generateToken(user._id, user.isAdmin ? "admin" : "user");

    /*
        ==========================================
        SUCCESS
        ==========================================
        */

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);

    res.status(500).json({
      message: "Server error during login",
    });
  }
};

/*
==========================================
ADMIN LOGIN
==========================================
*/

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    /*
        ==========================================
        FIND ADMIN
        ==========================================
        */

    const admin = await User.findOne({
      email,
      isAdmin: true,
    });

    if (!admin) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }

    /*
        ==========================================
        PASSWORD CHECK
        ==========================================
        */

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid admin credentials",
      });
    }

    /*
        ==========================================
        SUCCESS
        ==========================================
        */

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token: generateToken(admin._id, "admin"),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.log("Admin Login Error:", error);

    res.status(500).json({
      message: "Admin login failed",
    });
  }
};
