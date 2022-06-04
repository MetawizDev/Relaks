const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const getUser = async (key, value) => {
  const user = await User.query().where(key, "=", value).first();
  return user;
};

const createUser = async (data) => {
  const user = await User.query().insert(data);
  return user;
};

const updateUser = async (id, data) => {
  return await User.query().findById(id).patch(data);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  getUser,
  createUser,
  comparePassword,
  updateUser,
};
