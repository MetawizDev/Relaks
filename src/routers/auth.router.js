const express = require("express");
const { userRegisterHandler, userLoginHandler, facebookSuccessLoginHandler } = require("../controllers/auth.controller");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const userController = require("../controllers/user.controller");

const ValidationMiddleware = require("../middlewares/validation.middleware");
const { registerUser, loginUser } = require("../validation/user.schema");
const { roles } = require('../models/roles');

const AuthRouter = express.Router();

// Register Routers
AuthRouter.post("/manager/register", ValidationMiddleware(registerUser), userRegisterHandler(roles.MANAGER));
AuthRouter.post("/customer/register", ValidationMiddleware(registerUser), userRegisterHandler(roles.CUSTOMER));
AuthRouter.post("/login", ValidationMiddleware(loginUser), userLoginHandler());

// facebook auth related
AuthRouter.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

AuthRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/api/v1/auth/success",
    failureRedirect: "/api/v1/auth/fail",
  })
);

AuthRouter.get("/success", facebookSuccessLoginHandler);

AuthRouter.get("/fail", (req, res, next) => {
  res.status(400).json({ message: "facebook auth failed" });
});

// http://localhost:3000/api/v1/auth/facebook

/**
 * @swagger
 * /auth/admin/register:
 *   post:
 *     tags:
 *          - auth
 *
 * /auth/customer/register:
 *   post:
 *     tags:
 *          - auth
 *
 * /auth/login:
 *   post:
 *     tags:
 *          - auth
 */

module.exports = AuthRouter;
