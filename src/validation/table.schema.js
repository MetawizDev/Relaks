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
  postReserveTable: Joi.object({
    tableId: Joi.number().required(),
    checkIn: Joi.date().iso().required(),
    checkOut: Joi.date().iso().required(),
  }),
};

module.exports = Schema;
