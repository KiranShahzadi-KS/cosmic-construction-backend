const express = require("express");
const ApplicationForm = require("../models/applicationFormModel");
const {
  applicationValidation,
} = require("../validations/ApplicationFormValidation");
const JobPost = require("../models/jobPostModel");

//create
exports.createApplicationForm = async (req, res) => {
  const { error } = applicationValidation.validate(req.body);
  const { id } = req.params;
  if (error) return res.status(400).json({ error: error.details[0].message });

  if (error) return res.status(400).json({ error: error.details[0].message });

  if (!req.file) {
    return res
      .status(400)
      .json({ error: "CV is required and must be a PDF file." });
  }

  try {
    const jobPost = await JobPost.findById(id);
    if (!jobPost) {
      return res.status(404).json({ error: "Job post  not found!" });
    }

    const application = new ApplicationForm({
      ...req.body,
      job: id,
      cv: req.file.path,
    });

    const savedApplication = await application.save();

    jobPost.applications.push(savedApplication._id);

    await jobPost.save();

    res.status(201).json(savedApplication);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get all
exports.getAll = async (req, res) => {
  try {
    const applications = await ApplicationForm.find();
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get by id
exports.getById = async (req, res) => {
  try {
    const application = await ApplicationForm.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    // Find the existing application form by ID
    const application = await ApplicationForm.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }

    // Validate only the fields provided in the request
    const fieldsToUpdate = req.body;
    const { error } = applicationValidation.validate(fieldsToUpdate, {
      allowUnknown: true,
    });
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Update fields one by one, including handling for optional cv file
    if (req.body.firstName) application.firstName = req.body.firstName;
    if (req.body.lastName) application.lastName = req.body.lastName;
    if (req.body.email) application.email = req.body.email;
    if (req.body.phoneNumber) application.phoneNumber = req.body.phoneNumber;
    if (req.body.saySomething) application.saySomething = req.body.saySomething;
    if (req.body.portfolioLink)
      application.portfolioLink = req.body.portfolioLink;

    // If a new cv file is uploaded, update the cv field
    if (req.file) application.cv = req.file.path;

    // Save the updated application
    const updatedApplication = await application.save();
    res.status(200).json(updatedApplication);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//delete
exports.deleteApplication = async (req, res) => {
  try {
    const deletedApplication = await ApplicationForm.findByIdAndDelete(
      req.params.id
    );

    if (!deletedApplication) {
      return res.status(404).json({ error: "Application not found." });
    }

    res.status(200).json({ message: "Application successfully deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update
// exports.updateApplication = async (req, res) => {
//   const { error } = applicationValidation.validate(req.body);
//   if (error) return res.status(400).json({ error: error.details[0].message });

//   try {
//     const updatedApplication = await ApplicationForm.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, cv: req.file ? req.file.path : req.body.cv },
//       { new: true, runValidators: true }
//     );

//     if (!updatedApplication) {
//       return res.status(404).json({ error: "Application not found." });
//     }

//     res.status(200).json(updatedApplication);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
