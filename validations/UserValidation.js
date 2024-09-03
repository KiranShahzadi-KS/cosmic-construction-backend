const Joi = require("joi");

function validateUserSignup(body) {
  const userSchema = Joi.object({
    firstName: Joi.string().min(3).max(200).required().messages({
      "string.base": "First name should be a string.",
      "string.empty": "First name cannot be empty.",
      "string.min": "First name must be at least {#limit} characters long.",
      "string.max": "First name cannot be longer than {#limit} characters.",
      "any.required": "First name is required.",
    }),
    lastName: Joi.string().min(3).max(200).required().messages({
      "string.base": "Last name should be a string.",
      "string.empty": "Last name cannot be empty.",
      "string.min": "Last name must be at least {#limit} characters long.",
      "string.max": "Last name cannot be longer than {#limit} characters.",
      "any.required": "Last name is required.",
    }),
    userName: Joi.string().min(5).max(200).required().messages({
      "string.base": "User name should be a string.",
      "string.empty": "User name cannot be empty.",
      "string.min": "User name must be at least {#limit} characters long.",
      "string.max": "User name cannot be longer than {#limit} characters.",
      "any.required": "User name is required.",
    }),
    contact: Joi.string().min(10).max(15).required().messages({
      "string.base": "Contact should be a string.",
      "string.empty": "Contact cannot be empty.",
      "any.required": "Contact is required.",
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email should be a string.",
      "string.empty": "Email cannot be empty.",
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),
    role: Joi.string().valid("user", "admin").default("user").messages({
      "string.base": "Role should be a string.",
      "any.only": "Role must be either 'user' or 'admin'.",
    }),
    password: Joi.string()
      .min(8)
      .max(100)
      .pattern(
        new RegExp(
          "^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:'\"<>,.?\\/\\\\|]{8,100}$"
        )
      )
      .required()
      .messages({
        "string.base": "Password should be a string.",
        "string.empty": "Password cannot be empty.",
        "string.min": "Password must be at least {#limit} characters long.",
        "string.max": "Password cannot be longer than {#limit} characters.",
        "string.pattern.base":
          "Password must contain at least one letter, one number, and one special character.",
        "any.required": "Password is required.",
      }),
    confirmedPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Confirmed Password doesnot match.",
        "any.required": "Confirmed password is required",
      }),
  });

  return userSchema.validate(body, { abortEarly: false });
}

function validateUserLogin(body) {
  const userSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": "Email should be a string.",
      "string.empty": "Email cannot be empty.",
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),
    password: Joi.string()
      .min(8)
      .max(100)
      .pattern(
        new RegExp(
          "^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:'\"<>,.?\\/\\\\|]{8,100}$"
        )
      )
      .required()
      .messages({
        "string.base": "Password should be a string.",
        "string.empty": "Password cannot be empty.",
        "string.min": "Password must be at least {#limit} characters long.",
        "string.max": "Password cannot be longer than {#limit} characters.",
        "string.pattern.base":
          "Password must contain at least one letter, one number, and one special character.",
        "any.required": "Password is required.",
      }),
  });

  return userSchema.validate(body, { abortEarly: false });
}

module.exports = {
  validateUserSignup,
  validateUserLogin,
};
