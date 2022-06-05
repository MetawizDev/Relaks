const router = require("express").Router();
const orderController = require("../controllers/order.controller");
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");
const roles = require('../models/roles');
const ValidationMiddleware = require("../middlewares/validation.middleware");
const { postOrder, patchOrder } = require("../validation/order.schema");

router.get('/', AuthorizationMiddleware([roles.OWNER, roles.MANAGER, roles.CUSTOMER]), orderController.get_all_orders);

router.post('/', AuthorizationMiddleware([roles.CUSTOMER]), ValidationMiddleware(postOrder), orderController.create_order);

router.patch('/status/:orderId', AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(patchOrder), orderController.update_order_status);

/**
 * @swagger
 * components:
 *   schemas:
 *      FoodItem:
 *        type: object
 *        required:
 *          - id
 *          - quantity
 *          - portionId
 *        properties:
 *          id:
 *            type: integer
 *            description: Id of the food item
 *          quantity:
 *            type: integer
 *            description: No of food items in the given id
 *          portionId:
 *            type: integer
 *            description: Id of the portion
 *
 *      FoodItemRequest:
 *        type: object
 *        required:
 *          - id
 *          - quantity
 *          - portionId
 *        properties:
 *          id:
 *            type: integer
 *            description: Id of the food item
 *          quantity:
 *            type: integer
 *            description: No of food items in the given id
 *          portionId:
 *            type: integer
 *            description: Id of the portion
 *
 *      Order:
 *        type: object
 *        required:
 *          - type
 *          - noOfItems
 *          - totalPrice
 *          - status
 *          - foodItems
 *          - latitude
 *          - longitude
 *        properties:
 *          id:
 *            type: integer
 *            description: Auto-generated id
 *          type:
 *            type: string
 *            description: Delivered or Pickup
 *          noOfItems:
 *            type: string
 *          totalPrice:
 *            type: string
 *          latitude:
 *            type: string
 *          longitude:
 *            type: string
 *          status:
 *            type: string
 *            description: pending, prepared, cancelled
 *          foodItems:
 *            type: array
 *            description: Array of foodItems in the order
 *            items:
 *              oneOf:
 *                - $ref: '#/components/schemas/FoodItem'
 *                - $ref: '#/components/schemas/FoodItem'
 *          createdAt:
 *            type: string
 *            description: Created date and time
 *          updatedAt:
 *            type: string
 *            description: Updated date and time
 *
 *      OrderRequest:
 *        type: object
 *        required:
 *          - type
 *          - noOfItems
 *          - totalPrice
 *          - location
 *          - status
 *          - foodItems
 *        properties:
 *          type:
 *            type: string
 *            description: Delivered or Pickup
 *          noOfItems:
 *            type: string
 *          totalPrice:
 *            type: string
 *          location:
 *            $ref: '#/components/schemas/Location'
 *          status:
 *            type: string
 *            description: pending, prepared, cancelled
 *          foodItems:
 *            type: array
 *            description: Array of foodItems in the order
 *            items:
 *              oneOf:
 *                - $ref: '#/components/schemas/FoodItemRequest'
 *                - $ref: '#/components/schemas/FoodItemRequest'
 *      Location:
 *        type: object
 *        required:
 *          - latitude
 *          - longitude
 *        properties:
 *          latitude:
 *            type: string
 *          longitude:
 *            type: string
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: Bearer
 */

/**
 * @swagger
 * /api/v1/orders:
 *  get:
 *    summary: Get all the orders
 *    tags:
 *      - orders
 *    responses:
 *      '200':
 *        content:
 *          'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - $ref: '#/components/schemas/Order'
 *                       - $ref: '#/components/schemas/Order'
 *
 *  post:
 *    summary: Create an order
 *    security:
 *      - ApiKeyAuth: []
 *    tags:
 *      - orders
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OrderRequest'
 *    responses:
 *      '201':
 *        content:
 *          'application/json':
 *              schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *
 * /api/v1/orders/status/{id}:
 *  patch:
 *    summary: Update order status
 *    security:
 *      - ApiKeyAuth: []
 *    tags:
 *      - orders
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Id of the order
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - status
 *            properties:
 *              status:
 *                type: string
 *                description: status of the order
 *    responses:
 *      '200':
 *        content:
 *          'application/json':
 *              schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *
 *
 */

module.exports = router;
