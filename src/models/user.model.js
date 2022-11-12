const { Model } = require("objection");
const bcrypt = require("bcrypt");

class User extends Model {
  static get tableName() {
    return "user";
  }

  async $beforeInsert() {
    // facebook users dont have a password
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async $beforeUpdate() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.password;
    delete json.username;
    delete json.createdAt;
    delete json.updatedAt;
    delete json.resetToken;
    return json;
  }

  static get relationMappings() {
    const Order = require("./order.model");
    const TableUser = require("./table-user.model");

    return {
      orders: {
        relation: Model.HasManyRelation,
        modelClass: Order,
        join: {
          from: "user.id",
          to: "order.user_id",
        },
      },
      reservations: {
        relation: Model.ManyToManyRelation,
        modelClass: TableUser,
        join: {
          from: "user.id",
          to: "table_has_user.user_id",
        },
      },
    };
  }
}

module.exports = User;
