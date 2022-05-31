const Joi = require("joi");

const Schema = {
  postPortion: Joi.object({
    name: Joi.string().min(3).max(25).required(),
  }),
  patchPortion: Joi.object({
    name: Joi.string().min(3).max(25).required(),
  }),
};

module.exports = Schema;
