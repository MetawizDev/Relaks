const Joi = require("joi");

const Schema = {
  postPromotion: Joi.object({
    description: Joi.string().required(),
    isDelivery: Joi.boolean().required(),
    discount: Joi.number().required(),
    promotionItems: Joi.array()
      .items({
        foodItemId: Joi.number().required(),
        portionId: Joi.number().required(),
        quantity: Joi.number().required(),
      })
      .required(),
  }),
  patchPromotion: Joi.object({
    description: Joi.string(),
    isDelivery: Joi.boolean(),
    discount: Joi.number(),
    promotionItems: Joi.array().items({
      foodItemId: Joi.number().required(),
      portionId: Joi.number().required(),
      quantity: Joi.number().required(),
    }),
  }),
};

module.exports = Schema;
