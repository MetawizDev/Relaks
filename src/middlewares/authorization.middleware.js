const UnauthorizedException = require("../common/exceptions/UnauthorizedException");
const ForbiddenException = require("../common/exceptions/ForbiddenException");

const jwt = require("jsonwebtoken");
const env = require("../configs");

const { getUser } = require("../services/auth.service");

const AuthorizationMiddleware = (rolesAllowed) => {
  return async (req, res, next) => {
    try {
      // Check for authorization header
      if (!req.headers.authorization) throw new UnauthorizedException("Unauthorized! Please login to proceed.");

      // Chack for method
      const [method, token] = req.headers.authorization.split(" ");
      if (method !== "Bearer") throw new UnauthorizedException("Auth type invalid!");

      // Verify jwt and data
      const decoded = jwt.verify(token, env.SECRET, (err, decoded) => {
        if (err) throw new UnauthorizedException("jwt malformed!");
        return decoded;
      });

      const user = await getUser("username", decoded.username);

      if (!user) throw new UnauthorizedException("Unauthorized! Please login to proceed.");
      
      const validRole = rolesAllowed.includes(user.role);
      if (!validRole) throw new ForbiddenException();

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  AuthorizationMiddleware,
};
