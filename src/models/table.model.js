const { Model } = require("objection");

class Table extends Model {
  static get tableName() {
    return "table";
  }

  static relationMappings() {
    const User = require("./user.model");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "table.userId",
          to: "user.id",
        },
      },
    };
  }
}

module.exports = Table;
