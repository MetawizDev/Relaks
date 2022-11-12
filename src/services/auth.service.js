const bcrypt = require("bcrypt");
const roles = require("../models/roles");
const User = require("../models/user.model");

const getUser = async (key, value) => {
  const user = await User.query().where(key, "=", value).first();
  return user;
};

const getAllCustomers = async () => {
  return await User.query().where("role", "=", roles.CUSTOMER);
}

const createUser = async (data) => {
  const user = await User.query().insert(data);
  return user;
};

const updateUser = async (id, data) => {
  return await User.query().patchAndFetchById(id, data);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const saveResetToken = async (token, username) => {
  const salt = await bcrypt.genSalt();
  const hashedToken = await bcrypt.hash(token, salt);
  return await User.query().patch({ resetToken: hashedToken }).where("username", "=", username);
};

module.exports = {
  getUser,
  createUser,
  comparePassword,
  updateUser,
  saveResetToken,
  getAllCustomers
};
