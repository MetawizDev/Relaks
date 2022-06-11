const express = require("express");

const { getFoodItemsHandler, createFoodItemHandler, patchFoodItemHandler, deleteFoodItemsHandler, checkFoodItemHandler, patchFoodItemImageHandler, getFoodItemHandler, changeFoodAvailabilityHandler } = require("../controllers/food-item.controller");

const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");

const ValidationMiddleware = require("../middlewares/validation.middleware");
const { postFoodItem, patchFoodItem, patchAvailability } = require("../validation/food-item.schema");
const roles = require("../models/roles");
const fileUploadMiddleware = require("../middlewares/fileUpload.middleware");

const FoodItemRouter = express.Router();

FoodItemRouter.get("/", getFoodItemsHandler());
FoodItemRouter.post("/", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(postFoodItem), createFoodItemHandler());
FoodItemRouter.get("/:id", getFoodItemHandler());
FoodItemRouter.patch("/:id/image", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), checkFoodItemHandler(), fileUploadMiddleware(1), patchFoodItemImageHandler());
FoodItemRouter.patch("/:id", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(patchFoodItem), patchFoodItemHandler());
FoodItemRouter.delete("/:id", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), deleteFoodItemsHandler());
FoodItemRouter.patch("/change-availability/:id", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(patchAvailability), changeFoodAvailabilityHandler());

module.exports = FoodItemRouter;

/**
 * @swagger
 *components:
 *  schemas:
 *      Fooditem:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  description: Name of the food item
 *              category:
 *                  type: integer
 *                  description: Category id
 *              portions:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                          price:
 *                              type: number
 *                          calories:
 *                              type: number
 *                          isAvailable:
 *                              type: boolean
 */

/**
 * @swagger
 * /api/v1/food-items:
 *      get:
 *          summary: Get all food items - public
 *          tags:
 *              - Food Items
 *          parameters:
 *              -   in : query
 *                  name : categoryId
 *                  description: category id
 *                  schema:
 *                      type: integer
 *          responses:
 *              200:
 *                  description: List of food item objects
 *              404:
 *                  description: Category not found
 *
 *      post:
 *          summary: Create new food item - owner, manager
 *          tags:
 *          - Food Items
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Fooditem'
 *          responses:
 *              201:
 *                  description: New food item created
 *              409:
 *                  description: Food item already exists
 *              404:
 *                  description: Category or portion not found
 *              400:
 *                  description: Request body validation failed
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 *
 * /api/v1/food-items/{id}:
 *      get:
 *          summary: Get a single food item - public
 *          tags:
 *              - Food Items
 *          parameters:
 *              -   in : path
 *                  name : id
 *                  required: true
 *                  description: food item id
 *                  schema:
 *                      type: integer
 *          responses:
 *              200:
 *                  description: Food item object
 *              404:
 *                  description: Food item not found
 *
 *      patch:
 *          summary: Update a food item - owner, manager
 *          tags:
 *              -   Food Items
 *          parameters:
 *              -   in : path
 *                  name : id
 *                  required: true
 *                  description: food item id
 *                  schema:
 *                      type: integer
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Fooditem'
 *          responses:
 *              201:
 *                  description: New food item created
 *              409:
 *                  description: Food item already exists
 *              404:
 *                  description: Category or portion not found
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
 *              -   Food Items
 *          parameters:
 *              -   in : path
 *                  name : id
 *                  required: true
 *                  description: food item id
 *                  schema:
 *                      type: integer
 *          responses:
 *              200:
 *                  description: Deleted category object
 *              404:
 *                  description: CatFood item not found
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 *
 * /api/v1/food-items/{id}/image:
 *      patch:
 *          summary: Add/Update a food item image - owner, manager
 *          tags:
 *              -   Food Items
 *          parameters:
 *              -   in : path
 *                  name : id
 *                  required: true
 *                  description: food item id
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
 *                  description: Food item not found
 *              400:
 *                  description: Request body validation failed
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 *
 * /api/v1/food-items/change-availability/{id}:
 *      patch:
 *          summary: Change availability of the food item - owner, manager
 *          tags:
 *              -   Food Items
 *          parameters:
 *              -   in : path
 *                  name : id
 *                  required: true
 *                  description: food item id
 *                  schema:
 *                      type: integer
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              portionId:
 *                                  type: integer
 *                              isAvailable:
 *                                  type: boolean
 */
