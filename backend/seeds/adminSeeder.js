const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../models/User");

dotenv.config();

/*
==========================================
CONNECT DATABASE
==========================================
*/

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/*
==========================================
SEED ADMIN
==========================================
*/

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      email: "admin@dairy.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@dairy.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

seedAdmin();
