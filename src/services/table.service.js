const Table = require("../models/table.model");
const { raw } = require("objection");

const getTable = async (key, value) => {
  return await Table.query().where(key, "=", value).first();
};

const createTable = async (data) => {
  return await Table.query().insert(data);
};

const reserveTable = async (tableId, userId) => {
  return await Table.query().patchAndFetchById(tableId, {
    lastReservedAt: raw("now()"),
    userId,
  });
};

const getAvailableTables = async () => {
  return await Table.query().where(raw("TIMESTAMPDIFF(MINUTE,last_reserved_at, now()) > 15 or last_reserved_at is null"));
};

const getReservedTables = async () => {
  return await Table.query().where(raw("TIMESTAMPDIFF(MINUTE,last_reserved_at, now()) <= 15"));
};

const updateTable = async (id, data) => {
  return await Table.query().patchAndFetchById(id, data);
};

const deleteTable = async (id) => {
  return await Table.query().deleteById(id);
};
module.exports = {
  getTable,
  createTable,
  reserveTable,
  getAvailableTables,
  getReservedTables,
  updateTable,
  deleteTable,
};
