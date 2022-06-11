exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("portion")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("portion").insert([
        {
          name: "Small",
        },
        {
          name: "Medium",
        },
        {
          name: "Large",
        },
      ]);
    });
};
