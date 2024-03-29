const { Model } = require("objection");

class PromotionFooditemPortion extends Model {
  static get tableName() {
    return "promotion_has_food_item_has_portion";
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.createdAt;
    delete json.updatedAt;
    delete json.promotionId;
    delete json.id;
    delete json.foodItemId;
    delete json.portionId;
    return json;
  }

  static get relationMappings() {
    const FoodItem = require("./food-item.model");
    const Promotion = require("./promotion.model");
    const Portion = require("./portion.model");

    return {
      promotion: {
        relation: Model.BelongsToOneRelation,
        modelClass: Promotion,
        join: {
          from: "promotion_has_food_item_has_portion.promotion_id",
          to: "promotion.id",
        },
      },

      foodItem: {
        relation: Model.BelongsToOneRelation,
        modelClass: FoodItem,
        join: {
          from: "promotion_has_food_item_has_portion.food_item_id",
          to: "food_item.id",
        },
      },

      portion: {
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

module.exports = PromotionFooditemPortion;
