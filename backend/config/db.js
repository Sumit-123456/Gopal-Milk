const mongoose = require("mongoose");

/*
==========================================
DATABASE CONNECTION
==========================================
*/

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Database Connection Error:", error);

    process.exit(1);
  }
};

module.exports = connectDB;
