const ConflictException = require("../common/exceptions/ConflictException");
const NotFoundException = require("../common/exceptions/NotFoundException");
const { getCategory } = require("../services/category.service");
const { getAllFoodItems, createFoodItem, getFoodItem, getFoodItemsByCategory, patchFoodItem, deleteFoodItem } = require("../services/food-item.services");
const { getPortion } = require("../services/portion.service");

const getFoodItemsOfCategoryHandler = () => {
  return async (req, res, next) => {
    try {
      let foodItems;

      //   Get all food items
      if (!req.query.categoryId) foodItems = await getAllFoodItems();
      //   Get specific food items in a category when specified as query params
      else {
        //   Check for valid category
        const category = await getCategory("id", req.body.category);
        if (!category.length) throw new NotFoundException("Category does not exist!");
        foodItems = await getFoodItemsByCategory(req.query.categoryId);
      }

      res.status(200).json({
        message: "FoodItems fetched succefully",
        success: true,
        data: foodItems,
      });
    } catch (error) {
      next(error);
    }
  };
};

const createFoodItemHandler = () => {
  return async (req, res, next) => {
    try {
      // Check for fooditem with same name
      if (await getFoodItem("name", req.body.name)) throw new ConflictException("Fooditem already exist with same name!");

      //   Check for valid category
      const category = await getCategory("id", req.body.category);
      if (!category.length) throw new NotFoundException("Category does not exist!");

      //   Check for valid potions
      for (const portion of req.body.portions) {
        if (!(await getPortion(portion.id))) throw new NotFoundException("Portion does not exist!");
      }

      // Create food item
      const foodItem = await createFoodItem(req.body);

      res.status(201).json({
        message: "FoodItem created succesfully",
        success: true,
        data: foodItem,
      });
    } catch (error) {
      next(error);
    }
  };
};

const patchFoodItemHandler = () => {
  return async (req, res, next) => {
    try {
      // Check for valid fooditem
      if (!(await getFoodItem("id", req.params.id))) throw new NotFoundException("Food item does not exist!");

      let data = {
        id: req.params.id,
      };

      // Check for fooditem with same name
      if (req.body.name) {
        if (await getFoodItem("name", req.body.name)) throw new ConflictException("Food item already exist with same name!");
        data["name"] = req.body.name;
      }

      //   Check for valid category
      if (req.body.category) {
        let category = await getCategory("id", req.body.category);
        if (!category.length) throw new NotFoundException("Category does not exist!");
        data["category"] = category[0];
      }

      //   Check for valid portions
      if (req.body.portions) {
        for (const portion of req.body.portions) {
          if (!(await getPortion(portion.id))) throw new NotFoundException("Portion does not exist!");
        }
        data["portions"] = req.body.portions;
      }

      // Get all food items
      const foodItem = await patchFoodItem(data);

      res.status(201).json({
        message: "FoodItem created succesfully",
        success: true,
        data: foodItem,
      });
    } catch (error) {
      next(error);
    }
  };
};

const deleteFoodItemsHandler = () => {
  return async (req, res, next) => {
    try {
      // Check for valid fooditem
      if (!(await getFoodItem("id", req.params.id))) throw new NotFoundException("Food item does not exist!");

      //Delete Food Item
      await deleteFoodItem(req.params.id);

      res.status(201).json({
        message: "FoodItem created succesfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  getFoodItemsOfCategoryHandler,
  createFoodItemHandler,
  patchFoodItemHandler,
  deleteFoodItemsHandler,
};
