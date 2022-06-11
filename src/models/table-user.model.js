const { Model } = require("objection");

class PromotionFooditemPortion extends Model {
  static get tableName() {
    return "table_has_user";
  }

  static get relationMappings() {
    const User = require("./user.model");
    const Table = require("./table.model");

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "table_has_user.user_id",
          to: "user.id",
        },
      },

      table: {
        relation: Model.BelongsToOneRelation,
        modelClass: Table,
        join: {
          from: "table_has_user.table_id",
          to: "table.id",
        },
      },
    };
  }
}

module.exports = PromotionFooditemPortion;
