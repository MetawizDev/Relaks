const roles = require("../models/roles");
const User = require("../models/user.model");

const getAllManagers = async () => {
  return await User.query().where("role", "=", roles.MANAGER);
};

const deleteManager = async (id) => {
  return await User.query().deleteById(id);
};

const changeManagerStatus = async (id, isActive) => {
  return await User.query().findById(id).patch({ isActive });
};

module.exports = {
  getAllManagers,
  deleteManager,
  changeManagerStatus,
};
