const { roles } = require('../../models/roles');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user").insert([
        { first_name: "manager", last_name: "manager", email: "manager@cafeapp.com", username: "manager@cafeapp.com", password: "$2a$12$G0AwSHUELJZjxWfXgkPdQOT6rkW.JHajj69bVzPECjua8erv0YJky", mobile: "0771234567", role: roles.OWNER },
        { first_name: "customer", last_name: "customer", email: "customer@cafeapp.com", username: "customer@cafeapp.com", password: "$2a$12$G0AwSHUELJZjxWfXgkPdQOT6rkW.JHajj69bVzPECjua8erv0YJky", mobile: "0711234567", role: roles.CUSTOMER },
      ]);
    });
};
