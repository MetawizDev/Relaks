const tableService = require("../services/table.service");
const ConflictException = require("../common/exceptions/ConflictException");
const NotFoundException = require("../common/exceptions/NotFoundException");
const NotAcceptableException = require("../common/exceptions/NotAcceptableException");
const socketServer = require("../configs/socketConfig");
const Table = require("../models/table.model");
const TableUser = require("../models/table-user.model");

exports.getAllTablesHandler = () => {
  return async (req, res, next) => {
    try {
      const tables = await tableService.getAllTables();

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
      if (await tableService.getTable("tableNo", data.tableNo)) throw new ConflictException("Table already exists!");

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

exports.getAllReservedTablesHandler = () => {
  return async (req, res, next) => {
    try {
      // Get all reserved tables
      const reservedTables = await tableService.getAllReservedTables();

      res.status(201).json({
        message: "Table created successfully!",
        success: true,
        data: reservedTables,
      });
    } catch (error) {
      next(error);
    }
  };
};

exports.reserve_table = async (req, res, next) => {
  let { tableId, checkIn, checkOut } = req.body;
  checkIn = new Date(checkIn);
  checkOut = new Date(checkOut);
  const userId = req.user.id;

  try {
    const { isAvailable } = await Table.query().findById(tableId).throwIfNotFound({ message: "Table does not exist" });

    let canReserve = false;
    const reservedTables = await TableUser.query().where("tableId", "=", tableId);
    if (!reservedTables.length) {
      canReserve = true;
    }
    for (const { id, checkIn: tableCheckIn, checkOut: tableCheckOut } of reservedTables) {
      console.log(checkIn, checkOut);
      console.log(tableCheckIn, tableCheckOut);
      if(checkOut < tableCheckIn || tableCheckOut < checkIn) { // available
        canReserve = true;
        console.log('1')
        await TableUser.query().deleteById(id);
        break;
      } else if (checkIn.getTime() == tableCheckIn.getTime() && checkOut.getTime() == tableCheckOut.getTime()) {
        console.log('2')
        break;
      } else if(((checkIn - tableCheckIn)/(1000*60) > 15) && isAvailable) {
        canReserve = true;
        console.log('3')
        await TableUser.query().deleteById(id); // delete the old entry
        break;
      } else if(((checkOut - tableCheckIn)/(1000*60) > 15) && isAvailable) {
        canReserve = true;
        console.log('4')
        await TableUser.query().deleteById(id); // delete the old entry
        break;
      }
    }

    if (canReserve) {
      const data = await TableUser.query().insertAndFetch({ userId, tableId, checkIn, checkOut });
      res.status(200).json({ canReserve, data });
    } else {
      throw new NotAcceptableException("Table already reserved.");
    }
  } catch (error) {
    next(error);
  }
};
