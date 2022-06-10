const tableName = "table_has_user";

exports.up = function (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().references("id").inTable("user").notNullable();
    table.integer("table_id").unsigned().references("id").inTable("table").notNullable();
    table.timestamp("check_in").notNullable();
    table.timestamp("check_out").notNullable();

    // timestamps
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
