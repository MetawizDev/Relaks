const { Model } = require("objection");

class Category extends Model {
  static get tableName() {
    return "category";
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.createdAt;
    delete json.updatedAt;
    return json;
  }

  static relationMappings() {
    const FoodItem = require("./food-item.model");
    return {
      featuredItem: {
        relation: Model.BelongsToOneRelation,
        modelClass: FoodItem,
        join: {
          from: "category.featuredItemId",
          to: "food_item.id",
        },
      },
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
