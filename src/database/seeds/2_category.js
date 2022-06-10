exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("category")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("category").insert([
        {
          name: "Fried Rice",
          img_url: "https://relaks-cafe-s3.s3.eu-west-2.amazonaws.com/categories/1.jpeg",
        },
        {
          name: "Kottu",
          img_url: "https://relaks-cafe-s3.s3.eu-west-2.amazonaws.com/categories/2.jpeg",
        },
        {
          name: "Burger",
          img_url: "https://relaks-cafe-s3.s3.eu-west-2.amazonaws.com/categories/3.jpeg",
        },
      ]);
    });
};
