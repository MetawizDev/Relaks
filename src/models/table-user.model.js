const { Model } = require("objection");

class TableUser extends Model {
  static get tableName() {
    return "table_has_user";
  }

  async $beforeInsert() {
    this.checkIn = this.checkIn.toLocaleString("sv", { timeZone: "UTC" });
    this.checkOut = this.checkOut.toLocaleString("sv", { timeZone: "UTC" });
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.createdAt;
    delete json.updatedAt;
    return json;
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

module.exports = TableUser;
