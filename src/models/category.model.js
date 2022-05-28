const { Model } = require("objection");

class Category extends Model {
  static get tableName() {
    return "category";
  }

  static relationMappings() {
    const FoodItem = require("./food-item.model");
    return {
      foodItems: {
        relation: Model.HasManyRelation,
        modelClass: FoodItem,
        join: {
          from: "category.id",
          to: "food_item.categoryId",
        },
      },
    };
  }
}

module.exports = Category;
