const { getTable, createTable, getAllTables } = require("../services/table.service");
const ConflictException = require("../common/exceptions/ConflictException");
const NotFoundException = require("../common/exceptions/NotFoundException");
const NotAcceptableException = require("../common/exceptions/NotAcceptableException");
const socketServer = require("../configs/socketConfig");
const Table = require("../models/table.model");
const TableUser = require("../models/table-user.model");

exports.getAllTablesHandler = () => {
  return async (req, res, next) => {
    try {
      const tables = await getAllTables();

      res.status(200).json({
        message: "Tables fetched successfuly",
        success: true,
        data: tables,
      });
    } catch (error) {
      next(error);
    }
  };
};

exports.createTableHandler = () => {
  return async (req, res, next) => {
    try {
      const data = {
        tableNo: req.body.tableNo,
        isIndoor: req.body.isIndoor,
        seatingCapacity: req.body.seatingCapacity,
        isAvailable: true,
      };
      // Check for existing table
      if (await getTable("tableNo", data.tableNo)) throw new ConflictException("Table already exists!");

      // Create table
      const table = await createTable(data);

      res.status(201).json({
        message: "Table created successfully!",
        success: true,
        data: table,
      });
    } catch (error) {
      next(error);
    }
  };
};

exports.reserve_table = async (req, res, next) => {
  const { checkIn: userCheckIn, checkOut: userCheckOut } = req.body;

  try {
    const data = await TableUser.query().withGraphJoined('user');
  
    res.status(200).json({ data });
    
  } catch (error) {
    next(error);
  }
}
