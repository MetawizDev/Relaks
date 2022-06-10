const { Model } = require("objection");

class Table extends Model {
  static get tableName() {
    return "table";
  }

  static relationMappings() {
    const User = require("./user.model");
    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "table.id",
          through: {
            from: "table_has_user.tableId",
            to: "table_has_user.userId",
            extra: {
              checkIn: "check_in",
              checkOut: "check_out",
            },
          },
          to: "user.id",
        },
      },
    };
  }
}

module.exports = Table;
