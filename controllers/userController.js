const express = require("express");
const bcrypt = require("bcryptjs");
const { validateUserSignup } = require("../validations/userValidation");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { validateUserLogin } = require("../validations/userValidation");
const dotenv = require("dotenv");
dotenv.config();

const crypto = require("crypto");
const nodemailer = require("nodemailer");

//REGISTER
exports.registerUser = async (req, res) => {
  const { error } = validateUserSignup(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const {
    firstName,
    lastName,
    userName,
    contact,
    password,
    confirmedPassword,
    email,
    role,
  } = req.body;

  try {
    let user = await User.findOne({ userName });
    if (user)
      return res.status(400).json({ message: "Username already taken." });

    user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "Email already registered." });

    if (password !== confirmedPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    user = new User({
      firstName,
      lastName,
      userName,
      contact,
      password,
      confirmedPassword,
      email,
      role,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully.", user });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// User SignIn
exports.signinUser = async (req, res) => {
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15d",
    });

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      })
      .status(200)
      .json({
        message: "User signed in successfully",
        token,
        user,
      });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//Get all
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//get by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      text: `You are receiving this email because you (or someone else) requested a password reset for your account.\n\nPlease click on the following link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Reset password link sent to your email." });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmedPassword } = req.body;

  try {
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    if (password !== confirmedPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// update role
exports.updateRole = async (req, res) => {
  const { userId, newRole } = req.body;

  //validate new role
  if (!["user", "admin"].includes(newRole)) {
    return res
      .status(400)
      .json({ message: "Invalid role. Must be 'user' or 'adminn'" });
  }
  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update role
    user.role = newRole;
    await user.save();

    res.status(200).json({ message: "User role updated successfully.", user });
  } catch (error) {
    console.error("Error during role update:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
