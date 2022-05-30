const express = require("express");
const { getAllCategoriesHandler, postCategoryHandler, patchCategoryHandler, deleteCategoryHandler } = require("../controllers/category.controller");
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");

const ValidationMiddleware = require("../middlewares/validation.middleware");
const { postCategory, patchCategory } = require("../validation/category.schema");
const { roles } = require('../models/roles');

const CategoryRouter = express.Router();

// Category Routers
CategoryRouter.get("/", getAllCategoriesHandler());
CategoryRouter.post("/", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(postCategory), postCategoryHandler());
CategoryRouter.patch("/:id", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(patchCategory), patchCategoryHandler());
CategoryRouter.delete("/:id", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), deleteCategoryHandler());

/**
 * @swagger
 * /categories:
 *   get:
 *     tags:
 *          - category
 *
 *   post:
 *     tags:
 *          - category
 *
 * /categories/:id:
 *   patch:
 *     tags:
 *          - category
 *   delete:
 *     tags:
 *          - category
 */

module.exports = CategoryRouter;
