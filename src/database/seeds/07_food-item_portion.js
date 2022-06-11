exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("food_item_has_portion")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("food_item_has_portion").insert([
        {
          price: 150,
          calories: 2000,
          is_available: true,
          food_item_id: 1,
          portion_id: 2,
        },
        {
          price: 250,
          calories: 1000,
          is_available: false,
          food_item_id: 3,
          portion_id: 1,
        },
        {
          price: 500,
          calories: 1500,
          is_available: true,
          food_item_id: 5,
          portion_id: 3,
        },
      ]);
    });
};
