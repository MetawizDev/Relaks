const passport = require('passport');
const strategy = require('passport-facebook');
const UnauthorizedException = require('../common/exceptions/UnauthorizedException');
const { getUser } = require("../services/auth.service");
const User = require('../models/user.model');
const roles = require('../models/roles');

const FacebookStrategy = strategy.Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ["email", "name"]
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, email, first_name: firstName, last_name: lastName } = profile._json;
    const userData = {
      first_name: firstName,
      last_name: lastName,
      username: id, 
      email,
      role: roles.CUSTOMER
    };

    try {
      const existingUser = await getUser("username", id);
      if(existingUser) {
        return done(null, {email, id});
      } 
      // create entry in db
      await User.query().insert(userData);
      done(null, {email, id});
      
    } catch (error) {
      done(error, false, error.message);
    }
  }
));