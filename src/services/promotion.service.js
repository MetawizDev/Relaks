const Promotion = require("../models/promotion.model");
const PromotionFooditemPortion = require("../models/promotion-fooditem-portion.model");

const getAllPromotions = async () => {
  // Get all promotions
  return await Promotion.query().withGraphJoined("promotionItems");

  // // For each promotion get promotion items
  // for (let promotion of promotions) {
  //   promotion.promotionItems = [];
  //   promotion.promotionItems.push(await PromotionFooditemPortion.query().select("id", "foodItemId", "portionId", "quantity").where("promotionId", "=", promotion.id));
  // }
};

const createPromotion = async (promotionDetails, promotionItems) => {
  // Insert promotion
  let promotion = await Promotion.query().insertAndFetch(promotionDetails);

  promotion.promotionItems = [];

  for (const item of promotionItems) {
    promotion.promotionItems.push(await Promotion.relatedQuery("promotionItems").for(promotion.id).insertAndFetch(item));
  }

  return promotion;
  // let result = await Promotion.relatedQuery("promotionItems").for(promotion.id).insert(promotionItems);

  // return result;

  // // Insert food items and portion in promotion
  // for (const { foodItemId, portionId, quantity } of promotionItems) {
  //   promotion.promotionItems.push(
  //     await PromotionFooditemPortion.query().insert({
  //       promotionId: promotion.id,
  //       foodItemId,
  //       portionId,
  //       quantity,
  //     })
  //   );
  // }
};

const getPromotion = (id) => {
  return Promotion.query().findById(id);
};

const deletePromotion = async (id) => {
  // Delete entries in the join table
  await PromotionFooditemPortion.query().delete().where("promotionId", id);

  //Delete the promotion
  await Promotion.query().deleteById(id);
};

const updatePromotionImage = async (id, imgUrl) => {
  return await Promotion.query().patchAndFetchById(id, { imgUrl });
};

const incrimentPromotionCount = async (id) => {
  await Promotion.query().findById(id).increment("count", 1);
};

module.exports = {
  createPromotion,
  getAllPromotions,
  deletePromotion,
  getPromotion,
  incrimentPromotionCount,
  updatePromotionImage,
};
