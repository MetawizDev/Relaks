const express = require("express");
const { createTableHandler, getTablesHandler, reserveTableHandler, updateTableHandler, deleteTableHandler } = require("../controllers/table.controller");
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware");
const roles = require("../models/roles");

const TableRouter = express.Router();

TableRouter.get("/", getTablesHandler());
TableRouter.post("/", createTableHandler());
TableRouter.patch("/:id", updateTableHandler());
TableRouter.delete("/:id", deleteTableHandler());

TableRouter.post("/reserve-table", AuthorizationMiddleware([roles.CUSTOMER]), reserveTableHandler());

module.exports = TableRouter;
