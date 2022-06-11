const { Model } = require("objection");

class Table extends Model {
  static get tableName() {
    return "table";
  }

  static relationMappings() {
    const TableUser = require("./table-user.model");
    return {
      reservations: {
        relation: Model.ManyToManyRelation,
        modelClass: TableUser,
        join: {
          from: "table.id",
          to: "table_has_user.table_id",
        },
      },
    };
  }
}

module.exports = Table;
