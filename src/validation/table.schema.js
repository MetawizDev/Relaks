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
    isIndoor: Joi.boolean(),
  }),
  postReserveTable: Joi.object({
    tableId: Joi.number().required(),
    checkIn: Joi.date().iso().required().greater("now"),
    checkOut: Joi.date().iso().required().greater(Joi.ref("checkIn")),
    note: Joi.string(),
  }),
  postAvailableTables: Joi.object({
    checkIn: Joi.date().iso().required().greater("now"),
    checkOut: Joi.date().iso().required().greater(Joi.ref("checkIn")),
  }),
};

module.exports = Schema;
