const express = require("express");
const { getAllCategoriesHandler, postCategoryHandler, patchCategoryHandler, deleteCategoryHandler, checkCatergoryHandler, patchCategoryImageHandler } = require("../controllers/category.controller");
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");

const ValidationMiddleware = require("../middlewares/validation.middleware");
const { postCategory, patchCategory } = require("../validation/category.schema");
const roles = require("../models/roles");
const fileUploadMiddleware = require("../middlewares/fileUpload.middleware");

const CategoryRouter = express.Router();

// Category Routers
CategoryRouter.get("/", getAllCategoriesHandler());
CategoryRouter.post("/", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(postCategory), postCategoryHandler());
CategoryRouter.patch("/:id/image", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), checkCatergoryHandler(), fileUploadMiddleware("category", 1), patchCategoryImageHandler());
CategoryRouter.patch("/:id", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(patchCategory), patchCategoryHandler());
CategoryRouter.delete("/:id", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), deleteCategoryHandler());

module.exports = CategoryRouter;

/**
 * @swagger
 * components:
 *    schemas:
 *      Category:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            required: true
 *      PatchCategory:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          featuredItemId:
 *            type: integer
 */

/**
 * @swagger
 * /api/v1/categories:
 *      get:
 *          summary: Get all categories - public
 *          tags:
 *              - category
 *          parameters:
 *              -   in : query
 *                  name : limit
 *                  description: no of categories to be feeched
 *                  schema:
 *                      type: integer
 *          responses:
 *              200:
 *                  description: List of category objects
 *              406:
 *                  description: Category limit is invalid
 *
 *      post:
 *          summary: Create new category - owner, manager
 *          tags:
 *          - category
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Category'
 *          responses:
 *              201:
 *                  description: New category created
 *              409:
 *                  description: Category already exists
 *              400:
 *                  description: Request body validation failed
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 *
 * /api/v1/categories/{id}:
 *      patch:
 *          summary: Update a category - owner, manager
 *          tags:
 *              -   category
 *          parameters:
 *              -   in : path
 *                  name : id
 *                  required: true
 *                  description: category id
 *                  schema:
 *                      type: integer
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PatchCategory'
 *          responses:
 *              200:
 *                  description: Updated category object
 *              404:
 *                  description: Category not found
 *              409:
 *                  description: Category already exists
 *              400:
 *                  description: Request body validation failed
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 *
 *
 *      delete:
 *          summary: Delete a category - owner, manager
 *          tags:
 *              -   category
 *          parameters:
 *              -   in : path
 *                  name : id
 *                  required: true
 *                  description: category id
 *                  schema:
 *                      type: integer
 *          responses:
 *              200:
 *                  description: Deleted category object
 *              404:
 *                  description: Category not found
 *              409:
 *                  description: Cannot delete category with food items
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 *
 * /api/v1/categories/{id}/image:
 *      patch:
 *          summary: Add/Update a category image - owner, manager
 *          tags:
 *              -   category
 *          parameters:
 *              -   in : path
 *                  name : id
 *                  required: true
 *                  description: category id
 *                  schema:
 *                      type: integer
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              file:
 *                                  type: file
 *          responses:
 *              200:
 *                  description: Image updated
 *              404:
 *                  description: Category not found
 *              400:
 *                  description: Request body validation failed
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 */
