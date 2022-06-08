const router = require("express").Router();
const trendingController = require("../controllers/trending.controller");
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");
const roles = require('../models/roles');

router.get("/", trendingController.get_trendings);

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
 *                          foodItemId:
 *                            type: integer
 *                            example: 4 
 */

module.exports = router;