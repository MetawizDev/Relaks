const Joi = require("joi");

const Schema = {
  postOrder: Joi.object({
    isDelivery: Joi.boolean().required(),
    noOfItems: Joi.number().required(),
    totalPrice: Joi.number().required(),
    promotionId: Joi.number(),
    refId: Joi.string().required(),
    location: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
    }).required(),
    foodItems: Joi.array()
      .items({
        id: Joi.number(),
        quantity: Joi.number(),
        portionId: Joi.number(),
        note: Joi.string(),
      })
      .required(),
  }),
  patchOrder: Joi.object({
    status: Joi.string().valid("accepted", "completed", "cancelled").required(),
  }),
};

module.exports = Schema;
