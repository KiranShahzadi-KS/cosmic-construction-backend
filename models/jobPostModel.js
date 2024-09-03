const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema(
  {
    vacancy: {
      type: Number,
      required: [true, "Vacancy is required."],
    },
    employmentStatus: {
      type: String,
      required: [true, "Employment Status is required."],
    },
    jobResponsibilities: {
      type: String,
      required: [true, "Job Responsibilities is required."],
    },
    educationalRequirement: {
      type: String,
    },
    experienceRequirement: {
      type: String,
      required: [true, "Experience is required."],
    },
    additionalRequirement: {
      type: String,
    },
    salary: {
      type: String,
      required: [true, "Salary is required."],
    },
    jobLocation: {
      type: String,
      required: [true, "Location is required."],
    },
    applyMail: {
      type: String,
      required: [true, "Apply mail is required."],
    },
    compensationBenefitOthers: {
      type: String,
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "JobCategories" },

    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApplicationForm",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobPost", jobPostSchema);
