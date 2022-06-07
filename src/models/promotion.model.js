const { Model } = require("objection");

class Promotion extends Model {
  static get tableName() {
    return "promotion";
  }

  static get relationMappings() {
    const FoodItem = require("./food-item.model");
    const Portion = require("./portion.model");

    return {
      promotionItems: {
        relation: Model.ManyToManyRelation,
        modelClass: FoodItem,
        join: {
          from: "promotion.id",
          through: {
            from: "promotion_has_food_item_has_portion.promotion_id",
            to: "promotion_has_food_item_has_portion.food_item_id",
            extra: ["quantity"],
          },
          to: "food_item.id",
        },
      },
      // portions: {
      //   relation: Model.ManyToManyRelation,
      //   modelClass: Portion,
      //   join: {
      //     from: "promotion.id",
      //     through: {
      //       from: "promotion_has_food_item_has_portion.promotion_id",
      //       to: "promotion_has_food_item_has_portion.portion_id",
      //       extra: ["quantity"],
      //     },
      //     to: "portion.id",
      //   },
      // },
    };
  }
}

module.exports = Promotion;
