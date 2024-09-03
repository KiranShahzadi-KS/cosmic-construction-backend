const express = require("express");
const {
  registerUser,
  signinUser,
  forgotPassword,
  resetPassword,
  updateRole,
  getAllUsers,
  getUserById,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/signin", signinUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/role", updateRole);

router.get("/", getAllUsers);
router.get("/id", getUserById);

module.exports = router;
