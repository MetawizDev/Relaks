const express = require("express");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20");

const env = require("../configs");
const { googleSuccessLoginHandler, googleFailedLoginHandler } = require("../controllers/auth.controller");
const roles = require("../models/roles");
const loginType = require("../models/loginType");
const { createUser, getUser } = require("../services/auth.service");

const GoogleAuthRouter = express.Router();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { email, given_name: first_name, family_name: last_name } = profile._json;

      const userData = {
        first_name,
        last_name,
        username: email,
        email,
        role: roles.CUSTOMER,
        loginType: loginType.GOOGLE,
      };

      try {
        const existingUser = await getUser("username", userData.username);
        if (existingUser) {
          return done(null, userData);
        }
        // create entry in db
        await createUser(userData);
        done(null, userData);
      } catch (error) {
        done(null, false);
      }
    }
  )
);

GoogleAuthRouter.get("/", passport.authenticate("google", { scope: ["profile", "email"] }));

GoogleAuthRouter.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/api/v1/auth/google/success",
    failureRedirect: "/api/v1/auth/google/fail",
  })
);

GoogleAuthRouter.get("/success", googleSuccessLoginHandler());

GoogleAuthRouter.get("/fail", googleFailedLoginHandler());

module.exports = GoogleAuthRouter;
