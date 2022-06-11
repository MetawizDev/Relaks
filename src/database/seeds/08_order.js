exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("order")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("order").insert([
        {
          is_delivery: true,
          no_of_items: 1,
          total_price: 500,
          status: "completed",
          latitude: 123.12,
          longitude: 123.45,
          user_id: 3,
          ref_id: "asdadadadq213423sdf",
        },
      ]);
    });
};
