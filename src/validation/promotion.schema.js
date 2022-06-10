const Joi = require("joi");

const Schema = {
  postPromotion: Joi.object({
    description: Joi.string().required(),
    isDelivery: Joi.boolean().required(),
    discount: Joi.number().required(),
    totalPrice: Joi.number().required(),
    expiryDate: Joi.date().iso().required(),
    promotionItems: Joi.array()
      .items({
        foodItemId: Joi.number().required(),
        portionId: Joi.number().required(),
        quantity: Joi.number().required(),
      })
      .required(),
  }),
};

module.exports = Schema;
