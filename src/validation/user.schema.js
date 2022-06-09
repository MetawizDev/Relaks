const Joi = require("joi");

const Schema = {
  registerUser: Joi.object({
    firstName: Joi.string().alphanum().min(3).max(25).required(),
    lastName: Joi.string().alphanum().min(3).max(25).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string()
      .pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/)
      .required(),
    mobile: Joi.string().pattern(new RegExp("^[0-9]{10}$")).required(),
  }),
  loginUser: Joi.object({
    email: Joi.string().email().required().max(255),
    password: Joi.string().required(),
  }),
  resetPasswordSchema: Joi.object({
    token: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string()
      .pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/)
      .required(),
  }),
};

module.exports = Schema;
