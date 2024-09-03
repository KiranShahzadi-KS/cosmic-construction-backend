const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required."],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last name is required."],
    },
    userName: {
      type: String,
      trim: true,
      required: [true, "User name is required."],
      unique: [true, "User name must be unique."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email must be unique."],
    },
    contact: { type: String, required: [true, "Contact is required."] },
    password: { type: String, required: [true, "Password is required."] },
    confirmedPassword: {
      type: String,
      required: [true, "Confirmed password is required."],
    },
    role: { type: String, enum: ["user", "vendor", "admin"], default: "user" },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    carts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmedPassword = this.password;
    next();
  } catch (error) {
    console.error("Error during password hashing:", error);
    next(error);
  }
});

// Password comparison method
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
