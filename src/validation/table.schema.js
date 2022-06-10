const Joi = require("joi");

const Schema = {
  postTable: Joi.object({
    tableNo: Joi.number().required(),
    seatingCapacity: Joi.number().required(),
    isIndoor: Joi.boolean().required(),
  }),
  patchTable: Joi.object({
    tableNo: Joi.number(),
    seatingCapacity: Joi.number(),
  }),
  reserveTable: Joi.object({
    id: Joi.number().required(),
  }),
};

module.exports = Schema;
