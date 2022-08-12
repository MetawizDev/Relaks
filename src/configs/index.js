const { cleanEnv, num, str, any } = require("envalid");
require("dotenv").config();

const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  SECRET: str(),
  TOKEN_VALIDITY: str(),
  DB_HOST: str(),
  DB_PORT: num({ default: 3306 }),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),
  NODE_ENV: str({ default: "development" }),
  FACEBOOK_CLIENT_ID: str(),
  FACEBOOK_CLIENT_SECRET: str(),
  FACEBOOK_CALLBACK_URL: str(),
  SESSION_KEY: str(),
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  AWS_REGION: str(),
  AWS_BUCKET_NAME: str(),
  MAIL: str(),
  MAILPASSWORD: str(),
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  GOOGLE_CALLBACK_URL: str(),
});

module.exports = env;
