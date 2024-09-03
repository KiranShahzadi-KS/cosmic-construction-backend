const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/bdConnection");
const Router = require("./routes/indexRoute");
const cors = require("cors");
const app = express();

dotenv.config();

const path = require("path");

app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
//Middleware to prase JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded data (if needed)
app.use(express.urlencoded({ extended: true }));

//Server Connection
connectDB();

//Router Connection
app.use("/api/v1", Router);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//Server Start
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
