const express = require("express");
const { postPromotionHandler, getAllPromotionsHandler, deletePromotionHandler, updatePromotionHandler, checkPromotionHandler, patchPromotionImageHandler } = require("../controllers/promotion.controller");
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");
const ValidationMiddleware = require("../middlewares/validation.middleware");
const { postPromotion, patchPromotion } = require("../validation/promotion.schema");
const fileUploadMiddleware = require("../middlewares/fileUpload.middleware");
const roles = require("../models/roles");

const PromotionRouter = express.Router();

PromotionRouter.get("/", getAllPromotionsHandler());
PromotionRouter.post("/", AuthorizationMiddleware([roles.MANAGER, roles.OWNER]), ValidationMiddleware(postPromotion), postPromotionHandler());
PromotionRouter.patch("/:id/image", AuthorizationMiddleware([roles.MANAGER, roles.OWNER]), checkPromotionHandler(), fileUploadMiddleware(1), patchPromotionImageHandler());
PromotionRouter.delete("/:id", AuthorizationMiddleware([roles.MANAGER, roles.OWNER]), deletePromotionHandler());

module.exports = PromotionRouter;

/**
 * @swagger
 *components:
 *  schemas:
 *      Promotion:
 *          type: object
 *          properties:
 *              description:
 *                  type: string
 *                  description: description of the promotion
 *              isDelivery:
 *                  type: boolean
 *                  description: true if delivery, false if pickup
 *              discount:
 *                  type: number
 *                  description: discount percentage
 *              totalPrice:
 *                  type: number
 *                  description: total price before discount
 *              expiryDate:
 *                  type: string
 *                  description: date of expiry
 *                  example: 2022-06-10T10:54:40.000Z
 *              promotionItems:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          foodItemId:
 *                              type: integer
 *                          portionId:
 *                              type: integer
 *                          quantity:
 *                              type: integer
 */

/**
 * @swagger
 * /api/v1/promotions:
 *      get:
 *          summary: Get all promotions - public
 *          tags:
 *              -   Promotions
 *          responses:
 *              200:
 *                  description: List of food item objects
 *
 *      post:
 *          summary: Create new promotion - owner, manager
 *          tags:
 *              -   Promotions
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Promotion'
 *          responses:
 *              201:
 *                  description: New promotion created
 *              404:
 *                  description: Fooditem or portion not found
 *              400:
 *                  description: Request body validation failed
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 *
 * /api/v1/promotions/{id}:
 *      delete:
 *          summary: Delete a promotion - owner, manager
 *          tags:
 *              -   Promotions
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
 *              406:
 *                  description: Invalid query parameter
 *              404:
 *                  description: Promotion not found
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 *
 * /api/v1/promotions/{id}/image:
 *      patch:
 *          summary: Add/Update a promotion image - owner, manager
 *          tags:
 *              -   Promotions
 *          parameters:
 *              -   in : path
 *                  name : id
 *                  required: true
 *                  description: promotion id
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
 *                  description: Promotion not found
 *              400:
 *                  description: Request body validation failed
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 */
