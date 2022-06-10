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
          last_reserved_at: "2022-06-10 01:54:40",
          user_id: 3,
        },
        {
          table_no: 2,
          seating_capacity: 4,
          last_reserved_at: "2022-06-10 01:54:40",
        },
        {
          table_no: 3,
          seating_capacity: 4,
          last_reserved_at: "2022-06-10 01:54:40",
        },
      ]);
    });
};
