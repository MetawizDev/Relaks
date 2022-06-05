const roles = require("../models/roles");
const User = require("../models/user.model");

const getAllManagers = async () => {
  return await User.query().where("role", "=", roles.MANAGER);
};

const deleteManager = async (id) => {
  return await User.query().deleteById(id);
};

module.exports = {
  getAllManagers,
  deleteManager,
};
