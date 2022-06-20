exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("table")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("table").insert([
        {
          table_name: "Couple Table A",
          seating_capacity: 2,
          is_indoor: true,
        },
        {
          table_name: "Fourperson Table A",
          seating_capacity: 4,
          is_indoor: false,
        },
        {
          table_name: "Triple Table A",
          seating_capacity: 3,
          is_indoor: true,
        },
      ]);
    });
};
