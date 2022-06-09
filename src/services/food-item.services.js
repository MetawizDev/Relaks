const Category = require("../models/category.model");
const FoodItem = require("../models/food-item.model");
const Portion = require("../models/portion.model");

const getAllFoodItems = async () => {
  return await FoodItem.query().withGraphFetched("[category,portions]");
};

const getFoodItem = async (key, value) => {
  return await FoodItem.query().where(key, "=", value).first();
};

const getFoodItemWithPortions = async (id) => {
  return await FoodItem.query().findById(id).withGraphFetched("portions");
};

const createFoodItem = async ({ name, category, portions }) => {
  let foodItem = await Category.relatedQuery("foodItems").for(category).insert({ name });

  for (const portion of portions) {
    await Portion.relatedQuery("foodItems").for(portion.id).relate({
      id: foodItem.id,
      price: portion.price,
      calories: portion.calories,
      isAvailable: portion.isAvailable,
    });
  }

  foodItem = await FoodItem.query().findById(foodItem.id).withGraphFetched("[category,portions]");

  return foodItem;
};

const getFoodItemsByCategory = async (categoryId) => {
  return await FoodItem.query().where("food_item.category_id", "=", categoryId).withGraphFetched("[category,portions]");
};

const getFoodItemsIdsByCategory = async (categoryId) => {
  return await FoodItem.query().select("id").where("food_item.category_id", "=", categoryId);
};

const patchFoodItem = async (data) => {
  await FoodItem.query().upsertGraph(data, {
    relate: true,
    unrelate: true,
  });
  const foodItem = await FoodItem.query().findById(data.id).withGraphFetched("[category,portions]");

  return foodItem;
};

const deleteFoodItem = async (id) => {
  await FoodItem.relatedQuery("portions").for(id).unrelate();
  // await Category.relatedQuery("foodItems").for(id).unrelate().delete;
  await FoodItem.query().deleteById(id);
  return;
};

const updateFoodItemImage = async (id, imgUrl) => {
  return await FoodItem.query().patchAndFetchById(id, { imgUrl });
};

module.exports = {
  getAllFoodItems,
  getFoodItem,
  createFoodItem,
  getFoodItemsByCategory,
  patchFoodItem,
  deleteFoodItem,
  updateFoodItemImage,
  getFoodItemWithPortions,
  getFoodItemsIdsByCategory,
};
