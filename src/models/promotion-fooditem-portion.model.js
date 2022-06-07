const { Model } = require("objection");

class PromotionFooditemPortion extends Model {
  static get tableName() {
    return "promotion_has_food_item_has_portion";
  }

  //   static get idColumn() {
  //     return ["food_item_id", "order_id", "portion_id"];
  //   }

  static get relationMappings() {
    const FoodItem = require("./food-item.model");
    const Promotion = require("./promotion.model");
    const Portion = require("./portion.model");

    return {
      orders: {
        relation: Model.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: "promotion_has_food_item_has_portion.promotion_id",
          to: "order.id",
        },
      },

      foodItems: {
        relation: Model.BelongsToOneRelation,
        modelClass: FoodItem,
        join: {
          from: "promotion_has_food_item_has_portion.food_item_id",
          to: "food_item.id",
        },
      },

      portions: {
        relation: Model.BelongsToOneRelation,
        modelClass: Portion,
        join: {
          from: "promotion_has_food_item_has_portion.portion_id",
          to: "portion.id",
        },
      },
    };
  }
}

module.exports = OrderFooditemPortion;
