const tableName = "order";

exports.up = function (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments("id").primary();
    table.boolean("is_delivery").notNullable();
    table.integer("no_of_items").notNullable();
    table.decimal("total_price").notNullable();
    table.string("status").notNullable();
    table.decimal("latitude").notNullable();
    table.decimal("longitude").notNullable();
    table.integer("user_id").unsigned().notNullable().references("id").inTable("user");

    // timestamps
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
