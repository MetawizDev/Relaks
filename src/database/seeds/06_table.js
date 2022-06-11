exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("table")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("table").insert([
        {
          table_no: 1,
          seating_capacity: 4,
          is_indoor: true,
        },
        {
          table_no: 2,
          seating_capacity: 4,
          is_indoor: false,
        },
        {
          table_no: 3,
          seating_capacity: 4,
          is_indoor: true,
        },
      ]);
    });
};