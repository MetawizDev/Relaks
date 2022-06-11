const express = require("express");
const tableController = require("../controllers/table.controller");
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");
const ValidationMiddleware = require("../middlewares/validation.middleware");
const roles = require("../models/roles");
const Table = require("../models/table.model");
const { postTable, postReserveTable } = require("../validation/table.schema");

const TableRouter = express.Router();

TableRouter.get("/", tableController.getAllTablesHandler());
TableRouter.post("/", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(postTable), tableController.createTableHandler());
TableRouter.delete("/:id", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), tableController.delete_table);
TableRouter.patch("/:id", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), tableController.update_table);
TableRouter.post("/reserve-table", AuthorizationMiddleware([roles.CUSTOMER]), ValidationMiddleware(postReserveTable), tableController.reserve_table);
TableRouter.get("/reserved-tables", tableController.getAllReservedTablesHandler());

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
 *      ReserveTable:
 *        type: object
 *        properties:
 *          tableId:
 *            type: integer
 *            required: true
 *          checkIn:
 *            type: date
 *            required: true
 *            example: 2022-06-10T15:09:00.000Z
 *          checkOut:
 *            type: date
 *            required: true
 *            example: 2022-06-10T15:09:00.000Z
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
 * /api/v1/tables/{tableId}:
 *      delete:
 *          summary: Delete a non-reserved table
 *          tags:
 *              - Tables
 *          responses:
 *              200:
 *                  description: Deleted table object
 *
 *      patch:
 *          summary: Update a non-reserved table
 *          tags:
 *          - Tables
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Table'
 *          responses:
 *              200:
 *                  description: Updated table object
 * /api/v1/tables/reserve-table:
 *      post:
 *          summary: Reserve a table
 *          tags:
 *          - Tables
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ReserveTable'
 *          responses:
 *              200:
 *                  description: Reserved table object
 *
 */
