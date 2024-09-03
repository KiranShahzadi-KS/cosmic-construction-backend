const Joi = require("joi");

const applicationValidation = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required.",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "A valid email is required.",
    "string.empty": "Email is required.",
  }),
  phoneNumber: Joi.string().required().messages({
    "string.empty": "Contact is required.",
  }),
  saySomething: Joi.string().optional(),
  portfolioLink: Joi.string().uri().optional().messages({
    "string.uri": "Please provide a valid URL for the portfolio link.",
  }),
});

module.exports = { applicationValidation };
