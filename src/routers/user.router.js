const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");
const roles = require("../models/roles");

router.get("/", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), userController.get_all_customers);

module.exports = router;


/**
 * @swagger
 * components:
 *   schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *          email:
 *            type: string
 *          isActive:
 *            type: boolean
 *          mobile:
 *            type: string
 *          role:
 *            type: string
 *          loginType:
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
 * /api/v1/users:
 *  get:
 *    summary: Get all customers
 *    tags:
 *      - Users
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
 *                       - $ref: '#/components/schemas/User'
 *                       - $ref: '#/components/schemas/User'
 */