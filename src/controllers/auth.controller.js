const jwt = require("jsonwebtoken");
const env = require("../configs");
const crypto = require('crypto');

const ConflictException = require("../common/exceptions/ConflictException");
const UnauthorizedException = require("../common/exceptions/UnauthorizedException");
const NotFoundException = require("../common/exceptions/NotFoundException");
const NotAcceptableException = require("../common/exceptions/NotAcceptableException");

const authService = require("../services/auth.service");
const mailConfig = require('../configs/mailConfig');

const userRegisterHandler = (role) => {
  return async (req, res, next) => {
    try {
      // Check if the user exists
      if (await authService.getUser("username", req.body.email)) throw new ConflictException("A user already exist with the given email!");
      if (await authService.getUser("mobile", req.body.mobile)) throw new ConflictException("A user already exist with the given mobile!");

      // Create user
      req.body.role = role;
      req.body.username = req.body.email;
      let user = await authService.createUser(req.body);

      res.status(201).json({
        message: `${role} created successfully.`,
        success: true,
        data: user,
      });

      const body = `Welcome to Relaks. Your account has been created.`
      await mailConfig.sendMail('Hello from Relaks team!', body, req.body.email);
    } catch (error) {
      next(error);
    }
  };
};

const userLoginHandler = () => {
  return async (req, res, next) => {
    try {
      // Get the user from database
      const user = await authService.getUser("username", req.body.email);

      // Check if the user exists
      if (!user) throw new UnauthorizedException("Invalid email or password!");

      // Check if the password match
      if (!(await authService.comparePassword(req.body.password, user.password))) throw new UnauthorizedException("Invalid email or password!");

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
      const user = await authService.updateUser(req.user.id, req.body);

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

const requestPasswordReset = async (req, res, next) => {
  const username = req.query.username;
  try {
    const user = await authService.getUser('username', username);
    if(!user) throw new NotFoundException(`User not found with username ${username}`);

    
    const resetToken = crypto.randomBytes(32).toString('hex');

    await authService.saveResetToken(resetToken, username);
    console.log(resetToken);

    const host = req.get('host');
    const url = `${host}/password-reset?token=${resetToken}&username=${username}`;


    const body = `Here is your password reset link. ${url}`
    await mailConfig.sendMail('Password reset request from Relaks', body, username);

    res.status(200).json({
      data: 'A password reset link has been set to your email.'
    });

  } catch (error) {
    next(error);
  }
}

const passwordReset = async (req, res, next) => {
  const { token, username, password } = req.body;

  try {
    const user = await authService.getUser('username', username);
    if(!user) throw new NotFoundException(`User not found with username ${username}`);

    // comparing the token, same as password
    const valid = await authService.comparePassword(token, user.resetToken);

    if(!valid) throw new NotAcceptableException('Invalid reset token');

    await authService.updateUser(user.id, { password });

    res.status(200).json({
      message: 'Your password updated successfully'
    });

    const body = `Your password has been changed.`
    await mailConfig.sendMail('Password reset Successful', body, username);
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  userRegisterHandler,
  userLoginHandler,
  facebookSuccessLoginHandler,
  userUpdateHandler,
  requestPasswordReset,
  passwordReset
};
