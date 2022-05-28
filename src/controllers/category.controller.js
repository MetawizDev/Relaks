const ConflictException = require("../common/exceptions/ConflictException");
const NotFoundException = require("../common/exceptions/NotFoundException");
const { getAllCategories, createCategory, patchCategory, deleteCategory, getCategory, getFoodItemsOfCategory } = require("../services/category.service");

const getAllCategoriesHandler = () => {
  return async (req, res, next) => {
    try {
      // Get all categories
      const categories = await getAllCategories();

      res.status(200).json({
        message: "Categories fetched succefully",
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  };
};

const postCategoryHandler = () => {
  return async (req, res, next) => {
    try {
      // Check for existing category with same name
      let category = await getCategory("name", req.body.name);
      if (category.length) throw new ConflictException("Category already exist!");

      // Create new category
      category = await createCategory(req.body);

      res.status(201).json({
        message: "Category created successfully.",
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };
};

const patchCategoryHandler = () => {
  return async (req, res, next) => {
    try {
      // Check for valid category
      let category = await getCategory("id", req.params.id);
      if (!category.length) throw new NotFoundException("Category does not exist!");

      // Check for existing category with same name
      category = await getCategory("name", req.body.name);
      if (category.length) throw new ConflictException("Category already exist!");

      // Patch category
      category = await patchCategory(req.params.id, req.body);

      res.status(201).json({
        message: "Categories patched succefully",
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };
};

const deleteCategoryHandler = () => {
  return async (req, res, next) => {
    try {
      // Check for valid category
      const category = await getCategory("id", req.params.id);
      if (!category.length) throw new NotFoundException("Category does not exist!");

      // Check for food items in category
      const foodItems = await getFoodItemsOfCategory(req.params.id);
      if (foodItems.length) throw new ConflictException("Cannot delete category with existing foot items!");

      // Delete category
      await deleteCategory(req.params.id);

      res.status(200).json({
        message: "Category deleted succefully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  getAllCategoriesHandler,
  postCategoryHandler,
  patchCategoryHandler,
  deleteCategoryHandler,
};
