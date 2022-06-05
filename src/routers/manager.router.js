const express = require("express");
const { getAllManagersHandler } = require("../controllers/manager.controller");

const ManagerRouter = express.Router();

ManagerRouter.get("/", getAllManagersHandler());

module.exports = ManagerRouter;
