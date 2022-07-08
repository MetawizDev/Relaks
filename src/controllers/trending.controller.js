const OrderFooditemPortion = require("../models/order-foodItem-portion.model");
const { raw } = require("objection");

exports.get_trendings = async (req, res, next) => {
  try {
    const ids = await OrderFooditemPortion.query()
      .select('foodItemId')
      .withGraphJoined('foodItems')
      .where(raw("TIMESTAMPDIFF(DAY, order_has_food_item_has_portion.created_at, now()) < 30"))
      .limit(3)
      .count()
      .groupBy('foodItemId')
      .orderBy('count(*)', 'desc');
    const result = ids.map((val) => {
      return { count: val['count(*)'], foodItem: val.foodItems};
    })
    res.status(200).json({ data: result });
  } catch (error) {
    next(error)
  }

}