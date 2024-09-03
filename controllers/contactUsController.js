const express = require("express");
const Contact = require("../models/contactUsModel");

//Create
exports.contactCreate = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    const contactMessage = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });
    await contactMessage.save();

    res.status(201).json({
      message: "Your Message has been sent successfully.",
      contactMessage,
    });
  } catch (error) {
    console.error("Error while sending contact message:", error);
    res.status(500).json({
      message:
        "There was error in sending your message. Please try again later.",
    });
  }
};
