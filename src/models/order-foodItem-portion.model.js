const { Model } = require("objection");

class OrderFooditemPortion extends Model {
  static get tableName() {
    return "order_has_food_item_has_portion";
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.createdAt;
    delete json.updatedAt;
    return json;
  }

  static get idColumn() {
    return ["food_item_id", "order_id", "portion_id"];
  }

  static get relationMappings() {
    const FoodItem = require("./food-item.model");
    const Order = require("./order.model");
    const Portion = require("./portion.model");

    return {
      orders: {
        relation: Model.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: "order_has_food_item_has_portion.order_id",
          to: "order.id",
        },
      },

      foodItems: {
        relation: Model.BelongsToOneRelation,
        modelClass: FoodItem,
        join: {
          from: "order_has_food_item_has_portion.food_item_id",
          to: "food_item.id",
        },
      },

      portions: {
        relation: Model.BelongsToOneRelation,
        modelClass: Portion,
        join: {
          from: "order_has_food_item_has_portion.portion_id",
          to: "portion.id",
        },
      },
    };
  }
}

module.exports = OrderFooditemPortion;
