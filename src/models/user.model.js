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
    return json;
  }

  static get relationMappings() {
    const Order = require("./order.model");
    const Table = require("./table.model");

    return {
      orders: {
        relation: Model.HasManyRelation,
        modelClass: Order,
        join: {
          from: "user.id",
          to: "order.user_id",
        },
      },
      tables: {
        relation: Model.ManyToManyRelation,
        modelClass: Table,
        join: {
          from: "user.id",
          through: {
            from: "table_has_user.userId",
            to: "table_has_user.tableId",
            extra: {
              checkIn: "check_in",
              checkOut: "check_out",
            },
          },
          to: "table.id",
        },
      },
    };
  }

  //   static relationMappings = () => {
  //     return {
  //       roles: {
  //         relation: Model.ManyToManyRelation,
  //         modelClass: Role,
  //         filter: (query) => query.select("id", "name"),
  //         join: {
  //           from: "user.id",
  //           through: {
  //             from: "user_has_role.user_id",
  //             to: "user_has_role.role_id",
  //           },
  //           to: "role.id",
  //         },
  //       },
  //       reviews: {
  //         relation: Model.HasManyRelation,
  //         modelClass: Review,
  //         // filter: (query) => query.select("id", "price", "quantity", "discount"),
  //         join: {
  //           from: "user.id",
  //           to: "review.customerId",
  //         },
  //       },
  //     };
  //   };
}

module.exports = User;
