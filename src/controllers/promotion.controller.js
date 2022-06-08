const { getFoodItem } = require("../services/food-item.services");
const { createPromotion, getAllPromotions, deletePromotion, getPromotion, updatePromotion } = require("../services/promotion.service");
const NotFoundException = require("../common/exceptions/NotFoundException");
const NotAcceptableException = require("../common/exceptions/NotAcceptableException");
const { getPortion } = require("../services/portion.service");

const getAllPromotionsHandler = () => {
  return async (req, res, next) => {
    try {
      const promotions = await getAllPromotions();

      res.status(200).json({
        message: "Promotions fetched successfuly!",
        success: true,
        data: promotions,
      });
    } catch (error) {
      next(error);
    }
  };
};

const postPromotionHandler = () => {
  return async (req, res, next) => {
    try {
      const promotionDetails = {
        description: req.body.description,
        isDelivery: req.body.isDelivery,
        discount: req.body.discount,
        count: 0,
      };
      const promotionItems = req.body.promotionItems ? req.body.promotionItems : [];

      // Check for valid food items and portions
      for (const { foodItemId, portionId } of promotionItems) {
        if (!(await getFoodItem("id", foodItemId))) throw new NotFoundException(`Fooditem with ${foodItemId} not found!`);
        if (!(await getPortion(portionId))) throw new NotFoundException(`Portion with ${portionId} not found!`);
      }

      //   Create promotion
      const promotion = await createPromotion(promotionDetails, promotionItems);

      res.status(201).json({
        message: "Promotion created successfuly!",
        success: true,
        data: promotion,
      });
    } catch (error) {
      next(error);
    }
  };
};

const deletePromotionHandler = () => {
  return async (req, res, next) => {
    try {
      const promotionId = parseInt(req.params.id);

      if (isNaN(promotionId) | (promotionId <= 0)) throw new NotAcceptableException("Promotion id must be a positive integer!");

      if (!(await getPromotion(promotionId))) throw new NotFoundException("Promotion not found!");

      await deletePromotion(promotionId);

      res.status(200).json({
        message: "Promotion deleted successfuly!",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
};

const updatePromotionHandler = () => {
  return async (req, res, next) => {
    try {
      // Check for valid promotion
      const promotionId = parseInt(req.params.id);

      if (isNaN(promotionId) | (promotionId <= 0)) throw new NotAcceptableException("Promotion id must be a positive integer!");

      if (!(await getPromotion(promotionId))) throw new NotFoundException("Promotion not found!");

      // Check for valid food items and portions
      const promotionItems = req.body.promotionItems ? req.body.promotionItems : [];

      for (const { foodItemId, portionId } of promotionItems) {
        if (!(await getFoodItem("id", foodItemId))) throw new NotFoundException(`Fooditem with ${foodItemId} not found!`);
        if (!(await getPortion(portionId))) throw new NotFoundException(`Portion with ${portionId} not found!`);
      }

      const promotionDetails = {
        description: req.body.description,
        isDelivery: req.body.isDelivery,
        discount: req.body.discount,
      };

      const promotion = await updatePromotion(promotionId, promotionDetails, promotionItems);

      res.status(200).json({
        message: "Promotion updated successfuly!",
        success: true,
        data: promotion,
      });
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  getAllPromotionsHandler,
  postPromotionHandler,
  deletePromotionHandler,
  updatePromotionHandler,
};
