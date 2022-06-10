const Table = require("../models/table.model");
const { raw } = require("objection");

const getTable = async (key, value) => {
  return await Table.query().where(key, "=", value).first();
};

const createTable = async (data) => {
  return await Table.query().insertAndFetch(data);
};

const getAllTables = async () => {
  return await Table.query();
};

module.exports = {
  getTable,
  createTable,
  getAllTables,
};
