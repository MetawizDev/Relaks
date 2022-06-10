exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("order_has_food_item_has_portion")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("order_has_food_item_has_portion").insert([
        {
          food_item_id: 5,
          quantity: 1,
          note: "Please add extra cheese",
          portion_id: 3,
          order_id: 1,
        },
      ]);
    });
};
