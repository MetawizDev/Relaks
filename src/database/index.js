const { Model, knexSnakeCaseMappers } = require("objection");
const env = require("../configs");
const Knex = require("knex");

const connectionConfigs = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  timezone: "Z",
};

// if (env.isProduction && process.env.GCP_INSTANCE_CONNECTION_NAME) {
//   connectionConfigs.socketPath = `/cloudsql/${process.env.GCP_INSTANCE_CONNECTION_NAME}`;
// }

const knexConnection = Knex({
  client: "mysql2",
  connection: connectionConfigs,
  ...knexSnakeCaseMappers(),
});

const initDatabase = (knexObject) => {
  // pass the knex object to Model.
  Model.knex(knexObject);
};

module.exports = {
  knexConnection,
  initDatabase,
};
