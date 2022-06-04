const express = require("express");
const { userRegisterHandler, userLoginHandler, facebookSuccessLoginHandler } = require("../controllers/auth.controller");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const userController = require("../controllers/user.controller");

const ValidationMiddleware = require("../middlewares/validation.middleware");
const { registerUser, loginUser } = require("../validation/user.schema");
const roles = require("../models/roles");

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

module.exports = AuthRouter;

/**
 * @swagger
 * components:
 *    schemas:
 *      UserRegister:
 *        type: object
 *        properties:
 *          firstName:
 *            type: string
 *            required: true
 *          lastName:
 *            type: string
 *            required: true
 *          email:
 *            type: string
 *            required: true
 *          password:
 *            type: string
 *            required: true
 *          mobile:
 *            type: string
 *            required: true
 *      Login:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *            required: true
 *          password:
 *            type: string
 *            required: true
 */

/**
 * @swagger
 * /api/v1/auth/manager/register:
 *    post:
 *      summary: Register a new manager - owner
 *      tags:
 *        - auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserRegister'
 *      responses:
 *        201:
 *          description: New manager created
 *        409:
 *          description: User exist with same email or mobile
 *        400:
 *          description: Request body validation failed
 *        403:
 *          description: No access rights
 *        401:
 *          description: Authentication failed
 *
 * /api/v1/auth/customer/register:
 *    post:
 *      summary: Register a new customer - public
 *      tags:
 *        - auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserRegister'
 *      responses:
 *        201:
 *          description: New manager created
 *        409:
 *          description: User exist with same email or mobile
 *        400:
 *          description: Request body validation failed
 *
 * /api/v1/auth/login:
 *    post:
 *      summary: Login - public
 *      tags:
 *        - auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login'
 *      responses:
 *        200:
 *          description: Login success
 *        400:
 *          description: Request body validation failed
 *        401:
 *          description: Login failed
 */
