const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

exports.connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDB Connected!");
};
