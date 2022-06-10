const { Model } = require("objection");

class Promotion extends Model {
  static get tableName() {
    return "promotion";
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.createdAt;
    delete json.updatedAt;
    return json;
  }

  static get relationMappings() {
    const PromotionFoodItemPortion = require("./promotion-fooditem-portion.model");

    return {
      promotionItems: {
        relation: Model.HasManyRelation,
        modelClass: PromotionFoodItemPortion,
        join: {
          from: "promotion.id",
          to: "promotion_has_food_item_has_portion.promotionId",
        },
      },
    };
  }
}

module.exports = Promotion;
