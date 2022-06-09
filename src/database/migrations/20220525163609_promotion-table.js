const tableName = "promotion";

exports.up = function (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments("id").primary();
    table.string("description").notNullable();
    table.boolean("is_delivery").notNullable();
    table.integer("count").notNullable().unsigned();
    table.decimal("total_price").notNullable();
    table.decimal("discount").notNullable();
    table.string("img_url").unique();
    // table.date("expiry_date");

    // timestamps
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
