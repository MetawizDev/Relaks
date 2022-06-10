const env = require("./src/configs");

const connectionConfigs = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  timezone: "Z",
};

// if (env.isProduction && env.GCP_INSTANCE_CONNECTION_NAME) {
//   connectionConfigs.socketPath = `/cloudsql/${env.GCP_INSTANCE_CONNECTION_NAME}`;
// }

module.exports = {
  client: "mysql2",
  connection: connectionConfigs,
  seeds: {
    directory: "./src/database/seeds",
  },
  migrations: {
    directory: "./src/database/migrations",
    stub: "./src/database/stubs/migration.stub",
  },
};
