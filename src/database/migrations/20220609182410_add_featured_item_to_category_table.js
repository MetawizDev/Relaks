const tableName = "category";

exports.up = function (knex) {
  return knex.schema.alterTable(tableName, function (table) {
    table.integer("featured_item_id").unsigned().references("id").inTable("food_item");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
