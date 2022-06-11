const express = require("express");
const tableController = require("../controllers/table.controller");
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");
const ValidationMiddleware = require("../middlewares/validation.middleware");
const roles = require("../models/roles");
const { postTable, patchTable, reserveTable } = require("../validation/table.schema");

const TableRouter = express.Router();

TableRouter.get("/", tableController.getAllTablesHandler());
TableRouter.post("/", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(postTable), tableController.createTableHandler());
TableRouter.post("/reserve-table", tableController.reserve_table);

module.exports = TableRouter;

/**
 * @swagger
 * components:
 *    schemas:
 *      Table:
 *        type: object
 *        properties:
 *          tableNo:
 *            type: integer
 *            required: true
 *          seatingCapacity:
 *            type: integer
 *            required: true
 *          isIndoor:
 *            type: boolean
 *            required: true
 */

/**
 * @swagger
 * /api/v1/tables:
 *      get:
 *          summary: Get tables - public
 *          tags:
 *              - Tables
 *          responses:
 *              200:
 *                  description: List of table objects
 *
 *      post:
 *          summary: Create new table - owner, manager
 *          tags:
 *          - Tables
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Table'
 *          responses:
 *              201:
 *                  description: New table created
 *              409:
 *                  description: Table already exists
 *              400:
 *                  description: Request body validation failed
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 *
 */
