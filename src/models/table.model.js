const { Model } = require("objection");

class Table extends Model {
  static get tableName() {
    return "table";
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.createdAt;
    delete json.updatedAt;
    return json;
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
