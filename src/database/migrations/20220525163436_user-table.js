const tableName = "user";

exports.up = function (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments("id").primary();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("username").unique().notNullable();
    table.string("email").unique();
    table.string("password");
    table.string("mobile").unique();
    table.string("role").notNullable();
    table.string("reset_token");

    // timestamps
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
