const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../configs");

const ConflictException = require("../common/exceptions/ConflictException");
const UnauthorizedException = require("../common/exceptions/UnauthorizedException");

const { getUser, createUser, comparePassword, updateUser } = require("../services/auth.service");

const userRegisterHandler = (role) => {
  return async (req, res, next) => {
    try {
      // Check if the user exists
      if (await getUser("username", req.body.email)) throw new ConflictException("A user already exist with the given email!");
      if (await getUser("mobile", req.body.mobile)) throw new ConflictException("A user already exist with the given mobile!");

      // Create user
      req.body.role = role;
      req.body.username = req.body.email;
      let user = await createUser(req.body);

      res.status(201).json({
        message: `${role} created successfully.`,
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
};

const userLoginHandler = () => {
  return async (req, res, next) => {
    try {
      // Get the user from database
      const user = await getUser("username", req.body.email);

      // Check if the user exists
      if (!user) throw new UnauthorizedException("Invalid email or password!");

      // Check if the password match
      if (!(await comparePassword(req.body.password, user.password))) throw new UnauthorizedException("Invalid email or password!");

      // Generate jwt token
      const token = jwt.sign({ username: user.username }, env.SECRET, {
        expiresIn: env.TOKEN_VALIDITY,
      });

      const data = {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };

      res.status(200).json({
        message: `Login successful for the user ${user.email}`,
        success: true,
        token: token,
        expiresIn: env.TOKEN_VALIDITY,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
};

const userUpdateHandler = () => {
  return async (req, res, next) => {
    try {
      const user = await updateUser(req.user.id, req.body);

      res.status(200).json({
        message: `User update successful!`,
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
};

const facebookSuccessLoginHandler = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "you are not logged in" });
  }

  const accessToken = jwt.sign({ username: req.user.id }, process.env.SECRET, { expiresIn: process.env.TOKEN_VALIDITY });

  res.status(200).json({
    message: "Facebook login success",
    accessToken,
    expiresIn: process.env.TOKEN_VALIDITY,
  });
};

module.exports = {
  userRegisterHandler,
  userLoginHandler,
  facebookSuccessLoginHandler,
  userUpdateHandler,
};
