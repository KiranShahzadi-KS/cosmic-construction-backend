const express = require("express");
const { contactCreate } = require("../controllers/contactUsController");

const router = express.Router();

router.post("/create", contactCreate);

module.exports = router;
