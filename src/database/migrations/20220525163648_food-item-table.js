const tableName = "food_item";

exports.up = function (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments("id").primary();
    table.string("name", 25).notNullable().unique();
    table.integer("category_id").unsigned().notNullable().references("id").inTable("category");
    table.string("img_url").unique();
    // timestamps
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
