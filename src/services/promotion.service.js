const Promotion = require("../models/promotion.model");
const PromotionFooditemPortion = require("../models/promotion-fooditem-portion.model");

const getAllPromotions = async () => {
  const promotions = await Promotion.query();
  for (let promotion of promotions) {
    const promotionItems = await PromotionFooditemPortion.query().where("promotionId", "=", promotion.id);
    promotion.promotionItems = [];

    promotionItems.forEach((item) => {
      promotion.promotionItems = [...promotion.promotionItems, { foodItemId: item.foodItemId, portionId: item.portionId, quantity: item.quantity, id: item.id }];
    });
  }

  return promotions;
};

const createPromotion = async (promotionDetails, promotionItems) => {
  // Insert promotion
  let promotion = await Promotion.query().insert(promotionDetails);

  let insertedPromotionItems = [];

  // Insert food items and portion in promotion
  for (const { foodItemId, portionId, quantity } of promotionItems) {
    const promotionItem = await PromotionFooditemPortion.query().insert({
      promotionId: promotion.id,
      foodItemId,
      portionId,
      quantity,
    });
    insertedPromotionItems.push(promotionItem);
  }

  promotion = { ...promotion, promotionItems: insertedPromotionItems };

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
  let promotion = await Promotion.query().patchAndFetchById(id, promotionDetails);

  promotion.promotionItems = [];

  await PromotionFooditemPortion.query().delete().where("promotion_id", id);

  for (const item of promotionItems) {
    item.promotionId = id;
    promotion.promotionItems.push(await PromotionFooditemPortion.query().insert(item));
  }

  return promotion;
};

module.exports = {
  createPromotion,
  getAllPromotions,
  deletePromotion,
  getPromotion,
  updatePromotion,
};
