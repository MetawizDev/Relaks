const express = require("express");
const { createTableHandler, getTablesHandler, reserveTableHandler, updateTableHandler, deleteTableHandler } = require("../controllers/table.controller");
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");
const ValidationMiddleware = require("../middlewares/validation.middleware");
const roles = require("../models/roles");
const { postTable, patchTable, reserveTable } = require("../validation/table.schema");

const TableRouter = express.Router();

// TableRouter.get("/", getTablesHandler());
// TableRouter.post("/", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(postTable), createTableHandler());
// TableRouter.patch("/:id", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), ValidationMiddleware(patchTable), updateTableHandler());
// TableRouter.delete("/:id", AuthorizationMiddleware([roles.OWNER, roles.MANAGER]), deleteTableHandler());

// TableRouter.post("/reserve-table", AuthorizationMiddleware([roles.CUSTOMER]), ValidationMiddleware(reserveTable), reserveTableHandler());

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
 *      ReserveTable:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            required: true
 */

/**
 * @swagger
 * /api/v1/tables:
 *      get:
 *          summary: Get tables - public
 *          tags:
 *              - Tables
 *          parameters:
 *              -   in : query
 *                  name : reserved
 *                  description: ture for reserved tables only else available tables
 *                  schema:
 *                      type: boolean
 *          responses:
 *              200:
 *                  description: List of table objects
 *              406:
 *                  description: Invalid query parameter
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
 * /api/v1/tables/{id}:
 *      patch:
 *          summary: Update a table - owner, manager
 *          tags:
 *              -   Tables
 *          parameters:
 *              -   in : path
 *                  name : id
 *                  required: true
 *                  description: table id
 *                  schema:
 *                      type: integer
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Table'
 *          responses:
 *              200:
 *                  description: Updated table object
 *              406:
 *                  description: Table id invalid / Cannot update a reserved table
 *              404:
 *                  description: Table not found
 *              409:
 *                  description: Table already exists
 *              400:
 *                  description: Request body validation failed
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 *
 *
 *      delete:
 *          summary: Delete a table - owner, manager
 *          tags:
 *              -   Tables
 *          parameters:
 *              -   in : path
 *                  name : id
 *                  required: true
 *                  description: table id
 *                  schema:
 *                      type: integer
 *          responses:
 *              200:
 *                  description: Table deleted succesfuly
 *              406:
 *                  description: Table id invalid / Cannot delete reserved table
 *              404:
 *                  description: Table not found
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 *
 * /api/v1/tables/reserve-table:
 *      post:
 *          summary: Reserve a table - customer
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
 *              409:
 *                  description: Table already reserved
 *              404:
 *                  description: Table not found
 *              400:
 *                  description: Request body validation failed
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 */
