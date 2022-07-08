const router = require("express").Router();
const trendingController = require("../controllers/trending.controller");

router.get("/", trendingController.get_trendings);

/**
 * @swagger
 * components:
 *   schemas:
 *      TrendingFoodItem:
 *        type: object
 *        required:
 *          - id
 *          - name
 *          - categoryId
 *          - imgUrl
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *          categoryId:
 *            type: integer
 *          imgUrl:
 *            type: string
 */

/**
 * @swagger
 * /api/v1/trending:
 *  get:
 *    summary: Get trending food items
 *    tags:
 *      - trending
 *    responses:
 *      '200':
 *        content:
 *          'application/json':
 *             schema:
 *               type: object
 *               properties: 
 *                  data: 
 *                      type: array
 *                      items: 
 *                        type: object
 *                        properties:
 *                          count:
 *                            type: integer
 *                            example: 2
 *                          foodItem:
 *                            $ref: '#/components/schemas/TrendingFoodItem'
 */

module.exports = router;