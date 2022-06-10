const { Model } = require("objection");

class Portion extends Model {
  static tableName = "portion";

  static get relationMappings() {
    const FoodItem = require("./food-item.model");
    const Order = require("./order.model");
    // const Promotion = require("./promotion.model");

    return {
      foodItems: {
        relation: Model.ManyToManyRelation,
        modelClass: FoodItem,
        join: {
          from: "portion.id",
          through: {
            from: "food_item_has_portion.portion_id",
            to: "food_item_has_portion.food_item_id",
            extra: {
              price: "price",
              calories: "calories",
              isAvailable: "is_available",
            },
          },
          to: "food_item.id",
        },
      },
      orders: {
        relation: Model.ManyToManyRelation,
        modelClass: Order,
        join: {
          from: "portion.id",
          through: {
            from: "order_has_food_item_has_portion.portion_id",
            to: "order_has_food_item_has_portion.order_id",
            extra: ["quantity"],
          },
          to: "order.id",
        },
      },
      // promotions: {
      //   relation: Model.ManyToManyRelation,
      //   modelClass: Promotion,
      //   join: {
      //     from: "portion.id",
      //     through: {
      //       from: "promotion_has_food_item_has_portion.portion_id",
      //       to: "promotion_has_food_item_has_portion.promotion_id",
      //       extra: ["quantity"],
      //     },
      //     to: "order.id",
      //   },
      // },
    };
  }
}

module.exports = Portion;
