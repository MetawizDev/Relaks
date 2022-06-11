const Table = require("../models/table.model");
const TableUser = require("../models/table-user.model");

exports.getTable = async (key, value) => {
  return await Table.query().where(key, "=", value).first();
};

exports.createTable = async (data) => {
  return await Table.query().insertAndFetch(data);
};

exports.getAllTables = async () => {
  return await Table.query();
};

exports.getAllReservedTables = async () => {
  return TableUser.query().withGraphJoined("user").select("table_has_user.id", "table_has_user.checkIn", "table_has_user.checkOut");
};
