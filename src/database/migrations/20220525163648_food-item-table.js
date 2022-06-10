const tableName = "food_item";

exports.up = function (knex) {
  return knex.schema
    .createTable(tableName, (table) => {
      table.increments("id").primary();
      table.string("name", 25).notNullable().unique();
      table.integer("category_id").unsigned().notNullable().references("id").inTable("category");
      table.string("img_url").unique();
      // timestamps
      table.timestamps(true, true);
    })
    .alterTable("category", function (table) {
      table.integer("featured_item_id").unsigned().references("id").inTable("food_item");
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable("category", function (table) {
      table.dropForeign("featured_item_id");
    })
    .dropTable(tableName);
};
