const { getFoodItem } = require("../services/food-item.services");
const { createPromotion, getAllPromotions, deletePromotion, getPromotion, updatePromotionImage } = require("../services/promotion.service");
const NotFoundException = require("../common/exceptions/NotFoundException");
const NotAcceptableException = require("../common/exceptions/NotAcceptableException");
const { getPortion } = require("../services/portion.service");
const deleteImageHandler = require("../common/handlers/deleteImage.handler");

const getAllPromotionsHandler = () => {
  return async (req, res, next) => {
    try {
      const promotions = await getAllPromotions();

      promotions.forEach((promotion) => {
        promotion.isExpired = addIsExpired(promotion.expiryDate);
      });

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

const addIsExpired = (date) => {
  const currentDateTime = new Date();
  const expiryDate = new Date(date);
  if (expiryDate <= currentDateTime) {
    return true;
  } else {
    return false;
  }
};

const postPromotionHandler = () => {
  return async (req, res, next) => {
    try {
      const promotionDetails = {
        description: req.body.description,
        isDelivery: req.body.isDelivery,
        discount: req.body.discount,
        totalPrice: req.body.totalPrice,
        count: 0,
        expiryDate: new Date(req.body.expiryDate).toLocaleString("sv", { timeZone: "UTC" }),
      };
      const promotionItems = req.body.promotionItems ? req.body.promotionItems : [];

      // Check for valid food items and portions
      for (const { foodItemId, portionId } of promotionItems) {
        if (!(await getFoodItem("id", foodItemId))) throw new NotFoundException(`Fooditem with ${foodItemId} not found!`);
        if (!(await getPortion(portionId))) throw new NotFoundException(`Portion with ${portionId} not found!`);
      }

      //   Create promotion
      let promotion = await createPromotion(promotionDetails, promotionItems);

      promotion.isExpired = addIsExpired(promotion.expiryDate);

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

      const promotion = await getPromotion(promotionId);

      if (!promotion) throw new NotFoundException("Promotion not found!");

      if (promotion.imgUrl) {
        deleteImageHandler(promotion.imgUrl);
      }
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

const checkPromotionHandler = () => {
  return async (req, res, next) => {
    try {
      // Check for valid promotion
      const promotion = await getPromotion(req.params.id);
      if (!promotion) throw new NotFoundException("Promotion does not exist!");

      next();
    } catch (error) {
      next(error);
    }
  };
};

const patchPromotionImageHandler = () => {
  return async (req, res, next) => {
    try {
      const id = req.params.id;
      const imgUrl = req.body.imgUrl;

      if (!imgUrl) throw new ValidationException([{ message: "Invalid file." }]);

      // Update promotion image
      const promotion = await updatePromotionImage(id, imgUrl);

      res.status(200).json({
        message: "Promotion image updated successful!",
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
  checkPromotionHandler,
  patchPromotionImageHandler,
};
