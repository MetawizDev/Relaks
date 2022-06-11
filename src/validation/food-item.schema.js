const Joi = require("joi");

const Schema = {
  postFoodItem: Joi.object({
    name: Joi.string().min(3).max(25).required(),
    category: Joi.number().required(),
    portions: Joi.array()
      .items({
        id: Joi.number().required(),
        price: Joi.number().required(),
        calories: Joi.number().required(),
        isAvailable: Joi.boolean().required(),
      })
      .required(),
  }),
  patchFoodItem: Joi.object({
    name: Joi.string().min(3).max(25),
    category: Joi.number(),
    portions: Joi.array().items({
      id: Joi.number().required(),
      price: Joi.number(),
      calories: Joi.number(),
      isAvailable: Joi.boolean(),
    }),
  }),
  patchAvailability: Joi.object({
    portionId: Joi.number().required(),
    isAvailable: Joi.boolean().required(),
  }),
};

module.exports = Schema;
