const OrderFooditemPortion = require("../models/order-foodItem-portion.model");
const { raw } = require("objection");

exports.get_trendings = async (req, res, next) => {
  try {
    const ids = await OrderFooditemPortion.query()
      .select('foodItemId')
      .where(raw("TIMESTAMPDIFF(DAY,created_at, now()) < 30"))
      .limit(3)
      .count()
      .groupBy('foodItemId')
      .orderBy('count(*)', 'desc');
    const result = ids.map((val) => {
      return { count: val['count(*)'], foodItemId: val.foodItemId};
    })
    res.status(200).json({ data: result });
  } catch (error) {
    next(error)
  }

}