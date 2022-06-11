exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("promotion_has_food_item_has_portion")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("promotion_has_food_item_has_portion").insert([
        {
          food_item_id: 5,
          quantity: 1,
          portion_id: 3,
          promotion_id: 1,
        },
        {
          food_item_id: 5,
          quantity: 1,
          portion_id: 3,
          promotion_id: 1,
        },
        {
          food_item_id: 5,
          quantity: 1,
          portion_id: 3,
          promotion_id: 2,
        },
        {
          food_item_id: 5,
          quantity: 1,
          portion_id: 3,
          promotion_id: 2,
        },
      ]);
    });
};
