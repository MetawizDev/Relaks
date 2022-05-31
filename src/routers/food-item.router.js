const express = require("express");

const { getFoodItemsHandler, createFoodItemHandler, patchFoodItemHandler, deleteFoodItemsHandler } = require("../controllers/food-item.controller");

const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");

const ValidationMiddleware = require("../middlewares/validation.middleware");
const { postFoodItem, patchFoodItem } = require("../validation/food-item.schema");
const roles = require('../models/roles');

const FoodItemRouter = express.Router();

FoodItemRouter.get("/", getFoodItemsHandler());
FoodItemRouter.post("/", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(postFoodItem), createFoodItemHandler());
FoodItemRouter.patch("/:id", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(patchFoodItem), patchFoodItemHandler());
FoodItemRouter.delete("/:id", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), deleteFoodItemsHandler());

/**
 * @swagger
 * /food-items:
 *   get:
 *     tags:
 *          - Food Items
 *
 *   post:
 *     tags:
 *          - Food Items
 *
 * /items/:id:
 *   patch:
 *     tags:
 *          - Food Items
 *   delete:
 *     tags:
 *          - Food Items
 */

module.exports = FoodItemRouter;
