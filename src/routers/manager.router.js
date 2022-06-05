const express = require("express");
const { getAllManagersHandler, deleteManagerHandler } = require("../controllers/manager.controller");

const ManagerRouter = express.Router();

ManagerRouter.get("/", getAllManagersHandler());
ManagerRouter.delete("/:id", deleteManagerHandler());

module.exports = ManagerRouter;
