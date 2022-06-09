const Joi = require("joi");

const Schema = {
  postCategory: Joi.object({
    name: Joi.string().min(3).max(25).required(),
  }),
  patchCategory: Joi.object({
    name: Joi.string().min(3).max(25),
    featuredItemId: Joi.number(),
  }),
};

module.exports = Schema;
