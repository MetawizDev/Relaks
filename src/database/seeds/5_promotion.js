exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("promotion")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("promotion").insert([
        {
          description: "Some description about the promotion",
          is_delivery: true,
          count: 0,
          total_price: 1000,
          discount: 10,
          expiry_date: "2022-06-10 01:54:40",
          img_url: "https://relaks-cafe-s3.s3.eu-west-2.amazonaws.com/promotions/1.jpeg",
        },
        {
          description: "Some description about the promotion",
          is_delivery: true,
          count: 0,
          total_price: 500,
          discount: 20,
          expiry_date: "2022-06-11 01:54:40",
          img_url: "https://relaks-cafe-s3.s3.eu-west-2.amazonaws.com/promotions/2.jpeg",
        },
        {
          description: "Some description about the promotion",
          is_delivery: false,
          count: 0,
          total_price: 2000,
          discount: 50,
          expiry_date: "2022-06-12 01:54:40",
          img_url: "https://relaks-cafe-s3.s3.eu-west-2.amazonaws.com/promotions/3.jpeg",
        },
      ]);
    });
};
