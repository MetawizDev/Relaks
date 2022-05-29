const router = require('express').Router();
const portionController = require('../controllers/portion.controller');
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");

router.get('/', portionController.get_all_portions);

router.post('/', AuthorizationMiddleware('admin'), portionController.create_portion);

router.patch('/:portionId', AuthorizationMiddleware('admin'),portionController.update_portion);

router.delete('/:portionId', AuthorizationMiddleware('admin'),portionController.delete_portion);

/**
 * @swagger
 * components:
 *   schemas:
 *      Portion:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          id:
 *            type: integer
 *            description: Auto-generated id
 *          name:
 *            type: string
 *            description: Name of the portion
 *          createdAt:
 *            type: string
 *            description: Created date and time
 *          updatedAt:
 *            type: string
 *            description: Updated date and time
 *        example:
 *          id: 5
 *          name: Medium
 *          createdAt: 2022-05-29 08:21:59
 *          updatedAt: 2022-05-29 08:21:59
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
 * /api/v1/portions:
 *  get:
 *    summary: Get all the portions
 *    tags: 
 *      - portions
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
 *                       - $ref: '#/components/schemas/Portion'
 *                       - $ref: '#/components/schemas/Portion'
 *                    
 *  post:
 *    summary: Create a portion
 *    security: 
 *      - ApiKeyAuth: []
 *    tags: 
 *      - portions
 *    parameters:
 *      - in: body
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the portion
 *    responses: 
 *      '201': 
 *        content:
 *          'application/json': 
 *              schema: 
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: Portion created successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Portion'
 *                   
 * /api/v1/portions/{id}:
 *  patch:
 *    summary: Update a portion
 *    security: 
 *      - ApiKeyAuth: []
 *    tags:
 *      - portions
 *    parameters:
 *      - in: path
 *        name: id
 *        schema: 
 *          type: string
 *        required: true
 *        description: Id of the portion
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *                description: New name of the portion
 *    responses: 
 *      '200': 
 *        content:
 *          'application/json': 
 *              schema: 
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: Portion updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Portion'
 * 
 *  delete:
 *    summary: Delete a portion
 *    security: 
 *      - ApiKeyAuth: []
 *    tags:
 *      - portions
 *    parameters:
 *      - in: path
 *        name: id
 *        schema: 
 *          type: string
 *        required: true
 *        description: Id of the portion
 *    responses: 
 *      '200': 
 *        content:
 *          'application/json': 
 *             schema: 
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: Portion deleted successfully
 *                 data:
 *                   $ref: '#/components/schemas/Portion'
 * 
 */

module.exports = router;