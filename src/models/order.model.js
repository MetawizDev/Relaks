const { Model } = require("objection");

class Order extends Model {
  static get tableName() {
    return "order";
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.createdAt;
    delete json.updatedAt;
    return json;
  }

  static get relationMappings() {
    const FoodItem = require("./food-item.model");
    const User = require("./user.model");
    const Portion = require("./portion.model");

    return {
      foodItems: {
        relation: Model.ManyToManyRelation,
        modelClass: FoodItem,
        join: {
          from: "order.id",
          through: {
            from: "order_has_food_item_has_portion.order_id",
            to: "order_has_food_item_has_portion.food_item_id",
            extra: ["quantity"],
          },
          to: "food_item.id",
        },
      },
      portions: {
        relation: Model.ManyToManyRelation,
        modelClass: Portion,
        join: {
          from: "order.id",
          through: {
            from: "order_has_food_item_has_portion.order_id",
            to: "order_has_food_item_has_portion.portion_id",
            extra: ["quantity"],
          },
          to: "portion.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "order.user_id",
          to: "user.id",
        },
      },
    };
  }
}

module.exports = Order;
