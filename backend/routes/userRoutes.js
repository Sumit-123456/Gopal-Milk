const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/*
==========================================
GET USER PROFILE
==========================================
*/

router.get("/profile", protect, getUserProfile);

/*
==========================================
UPDATE PROFILE
==========================================
*/

router.put("/profile", protect, updateUserProfile);

/*
==========================================
ADMIN GET ALL USERS
==========================================
*/

router.get("/all-users", protect, adminOnly, getAllUsers);

/*
==========================================
ADMIN DELETE USER
==========================================
*/

router.delete("/delete-user/:id", protect, adminOnly, deleteUser);

module.exports = router;
