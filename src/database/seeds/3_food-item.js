exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("food_item")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("food_item").insert([
        {
          name: "Chicken Fried Rice",
          img_url: "https://relaks-cafe-s3.s3.eu-west-2.amazonaws.com/food-items/1.jpeg",
          category_id: 1,
        },
        {
          name: "Egg Fried Rice",
          img_url: "https://relaks-cafe-s3.s3.eu-west-2.amazonaws.com/food-items/2.jpeg",
          category_id: 1,
        },
        {
          name: "Chicken Kottu",
          img_url: "https://relaks-cafe-s3.s3.eu-west-2.amazonaws.com/food-items/3.jpeg",
          category_id: 2,
        },
        {
          name: "Egg Kottu",
          img_url: "https://relaks-cafe-s3.s3.eu-west-2.amazonaws.com/food-items/4.jpeg",
          category_id: 2,
        },
        {
          name: "Chicken Burger",
          img_url: "https://relaks-cafe-s3.s3.eu-west-2.amazonaws.com/food-items/5.jpeg",
          category_id: 3,
        },
        {
          name: "Beef Burger",
          img_url: "https://relaks-cafe-s3.s3.eu-west-2.amazonaws.com/food-items/6.jpeg",
          category_id: 3,
        },
      ]);
    });
};
