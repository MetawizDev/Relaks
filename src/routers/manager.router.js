const express = require("express");
const { getAllManagersHandler, deleteManagerHandler, changeManagerStatusHandler } = require("../controllers/manager.controller");
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");
const roles = require("../models/roles");

const ManagerRouter = express.Router();

ManagerRouter.get("/", AuthorizationMiddleware([roles.OWNER]), getAllManagersHandler());
ManagerRouter.patch("/:id", AuthorizationMiddleware([roles.OWNER]), changeManagerStatusHandler());
ManagerRouter.delete("/:id", AuthorizationMiddleware([roles.OWNER]), deleteManagerHandler());

module.exports = ManagerRouter;

/**
 * @swagger
 * /api/v1/managers:
 *      get:
 *          summary: Get all managers - owner
 *          tags:
 *              -   Manager
 *          responses:
 *              200:
 *                  description: List of category objects
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 *
 * /api/v1/managers/{id}:
 *      patch:
 *          summary: Change manager status - owner
 *          tags:
 *              -   Manager
 *          parameters:
 *              -   in : path
 *                  name : id
 *                  required: true
 *                  description: manager id
 *                  schema:
 *                      type: integer
 *              -   in : query
 *                  name : isActive
 *                  required: true
 *                  description: true to make active, false to make inactive
 *                  schema:
 *                      type: boolean
 *          responses:
 *              200:
 *                  description: Manager status changed successfuly
 *              406:
 *                  description: Invalid parameter
 *              404:
 *                  description: Manager does not exist
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 *
 *      delete:
 *          summary: Delete a manager - owner
 *          tags:
 *              -   Manager
 *          parameters:
 *              -   in : path
 *                  name : id
 *                  required: true
 *                  description: manager id
 *                  schema:
 *                      type: integer
 *          responses:
 *              200:
 *                  description: Deleted manager object
 *              404:
 *                  description: Manager does not exist
 *              403:
 *                  description: No access rights
 *              401:
 *                  description: Authentication failed
 */
