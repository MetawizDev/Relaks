const express = require("express");
const { userRegisterHandler, userLoginHandler, facebookSuccessLoginHandler, userUpdateHandler, requestPasswordReset, passwordReset } = require("../controllers/auth.controller");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const userController = require("../controllers/user.controller");

const ValidationMiddleware = require("../middlewares/validation.middleware");
const { registerUser, loginUser, resetPasswordSchema, updateUser } = require("../validation/user.schema");
const roles = require("../models/roles");
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");

const GoogleAuthRouter = require("./googleAuth.router");

const AuthRouter = express.Router();

// Register Routers
AuthRouter.post("/manager/register", ValidationMiddleware(registerUser), userRegisterHandler(roles.MANAGER));
AuthRouter.post("/customer/register", ValidationMiddleware(registerUser), userRegisterHandler(roles.CUSTOMER));

// password reset
AuthRouter.get("/password-reset", requestPasswordReset);
AuthRouter.post("/password-reset", ValidationMiddleware(resetPasswordSchema), passwordReset);

// Login routers
AuthRouter.post("/login", ValidationMiddleware(loginUser), userLoginHandler());

// Update user routers
AuthRouter.patch("/me", AuthorizationMiddleware([roles.OWNER, roles.MANAGER, roles.CUSTOMER]), ValidationMiddleware(updateUser), userUpdateHandler());

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

AuthRouter.use("/google", GoogleAuthRouter);

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
 *      UserUpdate:
 *        type: object
 *        properties:
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *          password:
 *            type: string
 *          mobile:
 *            type: string
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
 *
 * /api/v1/auth/me:
 *    patch:
 *      summary: Update logged in user details
 *      tags:
 *        - auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserUpdate'
 *      responses:
 *        201:
 *          description: User update sucessfully
 *        409:
 *          description: User exist with same mobile
 *        400:
 *          description: Request body validation failed
 *        403:
 *          description: No access rights
 *        401:
 *          description: Authentication failed
 *
 * /api/v1/auth/facebook:
 *    get:
 *      summary: Login using facebook - customer register only
 *      tags:
 *        - auth
 *
 * /api/v1/auth/google:
 *    get:
 *      summary: Login using google - customer register only
 *      tags:
 *        - auth
 *
 * /api/v1/auth/password-reset:
 *    get:
 *      summary: Request for a password reset link
 *      tags:
 *        - auth
 *      parameters:
 *      - in: query
 *        name: email
 *        description: Email of the user
 *
 *    post:
 *      summary: Send the password reset data
 *      tags:
 *        - auth
 *      parameters:
 *        - in: body
 *          type: object
 *          required:
 *            - token
 *            - email
 *            - password
 *          properties:
 *            token:
 *              type: string
 *              description: Password reset token sent via the email
 *            email:
 *              type: string
 *              description: Email of the user
 *            password:
 *              type: string
 *              description: New password for the user
 */
