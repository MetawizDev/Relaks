const roles = require("../../models/roles");
const loginType = require("../../models/loginType");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user").insert([
        { first_name: "owner", last_name: "owner", email: "owner@cafeapp.com", username: "owner@cafeapp.com", password: "$2a$12$G0AwSHUELJZjxWfXgkPdQOT6rkW.JHajj69bVzPECjua8erv0YJky", mobile: "0771234567", role: roles.OWNER, login_type: loginType.EMAIL },
        { first_name: "manager", last_name: "manager", email: "manager@cafeapp.com", username: "manager@cafeapp.com", password: "$2a$12$G0AwSHUELJZjxWfXgkPdQOT6rkW.JHajj69bVzPECjua8erv0YJky", mobile: "0711234567", role: roles.MANAGER, login_type: loginType.EMAIL },
        { first_name: "customer", last_name: "customer", email: "customer@cafeapp.com", username: "customer@cafeapp.com", password: "$2a$12$G0AwSHUELJZjxWfXgkPdQOT6rkW.JHajj69bVzPECjua8erv0YJky", mobile: "0721234567", role: roles.CUSTOMER, login_type: loginType.EMAIL },
        { first_name: "customer2", last_name: "customer2", email: "customer2@cafeapp.com", username: "customer2@cafeapp.com", password: "$2a$12$G0AwSHUELJZjxWfXgkPdQOT6rkW.JHajj69bVzPECjua8erv0YJky", mobile: "0731234567", role: roles.CUSTOMER, login_type: loginType.EMAIL },
      ]);
    });
};
