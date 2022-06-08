const Promotion = require("../models/promotion.model");
const PromotionFooditemPortion = require("../models/promotion-fooditem-portion.model");

const getAllPromotions = async () => {
  // Get all promotions
  const promotions = await Promotion.query().select("id", "description", "isDelivery", "count");

  // For each promotion get promotion items
  for (let promotion of promotions) {
    promotion.promotionItems = [];
    promotion.promotionItems.push(await PromotionFooditemPortion.query().select("id", "foodItemId", "portionId", "quantity").where("promotionId", "=", promotion.id));
  }

  return promotions;
};

const createPromotion = async (promotionDetails, promotionItems) => {
  // Insert promotion
  let promotion = await Promotion.query().insert(promotionDetails);

  promotion.promotionItems = [];

  // Insert food items and portion in promotion
  for (const { foodItemId, portionId, quantity } of promotionItems) {
    promotion.promotionItems.push(
      await PromotionFooditemPortion.query().insert({
        promotionId: promotion.id,
        foodItemId,
        portionId,
        quantity,
      })
    );
  }

  return promotion;
};

const getPromotion = (id) => {
  return Promotion.query().findById(id);
};

const deletePromotion = async (id) => {
  await Promotion.relatedQuery("promotionItems").for(id).unrelate();
  await Promotion.query().deleteById(id);
};

const updatePromotion = async (id, promotionDetails, promotionItems) => {
  // Update promotion details
  let promotion = await Promotion.query().patchAndFetchById(id, promotionDetails);

  if (promotionItems.length) {
    promotion.promotionItems = [];

    await PromotionFooditemPortion.query().delete().where("promotion_id", id);

    for (const item of promotionItems) {
      item.promotionId = id;
      promotion.promotionItems.push(await PromotionFooditemPortion.query().insert(item));
    }
  }

  return promotion;
};

const incrimentPromotionCount = async (id) => {
  await Promotion.query().findById(id).increment("count", 1);
};

module.exports = {
  createPromotion,
  getAllPromotions,
  deletePromotion,
  getPromotion,
  updatePromotion,
  incrimentPromotionCount,
};
