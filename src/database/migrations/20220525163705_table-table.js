const tableName = "table";

exports.up = function (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments("id").primary();
    table.integer("table_no", 25).notNullable().unique();
    table.integer("seating_capacity").notNullable();
    table.timestamp("last_reserved_at");
    table.integer("user_id").unsigned().references("id").inTable("user");

    // timestamps
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
