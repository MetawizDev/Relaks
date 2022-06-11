exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("table_has_user")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("table_has_user").insert([
        {
          user_id: 3,
          table_id: 1,
          check_in: '2022-06-11 08:00:00',
          check_out: '2022-06-11 09:00:00'
        },
        {
          user_id: 3,
          table_id: 2,
          check_in: '2022-06-12 11:00:00',
          check_out: '2022-06-12 12:00:00'
        },
        {
          user_id: 4,
          table_id: 3,
          check_in: '2022-06-11 06:00:00',
          check_out: '2022-06-11 07:00:00'
        },
      ]);
    });
};
