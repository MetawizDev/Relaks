const Promotion = require("../models/promotion.model");
const PromotionFooditemPortion = require("../models/promotion-fooditem-portion.model");

const getAllPromotions = async () => {
  // Get all promotions
  return await Promotion.query().withGraphJoined("promotionItems.[foodItem,portion]");
};

const createPromotion = async (promotionDetails, promotionItems) => {
  // Insert promotion
  let promotion = await Promotion.query().insertAndFetch(promotionDetails);

  promotion.promotionItems = [];

  for (const item of promotionItems) {
    promotion.promotionItems.push(await Promotion.relatedQuery("promotionItems").for(promotion.id).insertAndFetch(item));
  }

  return promotion;
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
