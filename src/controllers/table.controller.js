const tableService = require("../services/table.service");
const ConflictException = require("../common/exceptions/ConflictException");
const NotFoundException = require("../common/exceptions/NotFoundException");
const NotAcceptableException = require("../common/exceptions/NotAcceptableException");
const socketServer = require("../configs/socketConfig");
const Table = require("../models/table.model");
const TableUser = require("../models/table-user.model");
const nodeSchedule = require('node-schedule');

let scheduledJobs = {};

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
      };
      // Check for existing table
      if (await tableService.getTable("tableNo", data.tableNo)) throw new ConflictException("Table already exists!");

      // Create table
      const table = await tableService.createTable(data);

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
  let { tableId, checkIn, checkOut, note } = req.body;
  checkIn = new Date(checkIn);
  checkOut = new Date(checkOut);
  const userId = req.user.id;

  try {

    let canReserve = false;
    const reservedTables = await TableUser.query().where("tableId", "=", tableId);
    if (!reservedTables.length) {
      canReserve = true;
    }
    console.log(reservedTables);

    const values = [];
    for (const { id, checkIn: tableCheckIn, checkOut: tableCheckOut } of reservedTables) {
      if (checkOut < tableCheckIn || tableCheckOut < checkIn || checkIn.getTime() === tableCheckOut.getTime() || checkOut.getTime() === tableCheckIn.getTime()) { // available
        values.push(true);
      } else {
        values.push(false);
      }
    }

    canReserve = !values.includes(false);
    
    if (canReserve) {
      const data = await TableUser.query().insertAndFetch({ userId, tableId, checkIn, checkOut, note });
      const date = new Date(checkIn.setMinutes(checkIn.getMinutes() + 1));
      const job = nodeSchedule.scheduleJob(date, async () => {
        const deletedData = await TableUser.query().deleteById(data.id);
        delete scheduledJobs[data.id];
        console.log(scheduledJobs);
      }); 
      scheduledJobs[data.id] = job;
      console.log(scheduledJobs);
      res.status(200).json({ canReserve, data });
    } else {
      throw new NotAcceptableException("Table already reserved.");
    }
  } catch (error) {
    next(error);
  }
};


exports.delete_table = async (req, res, next) => {
  const tableId = req.params.id;

  try {
    const table = await Table.query().findById(tableId).throwIfNotFound({ message: 'Table does not exist.' });
    
    let canDelete = false;
    const reservedTables = await TableUser.query().where("tableId", "=", tableId);
    if (!reservedTables.length) {
      canDelete = true;
    }
    
    if (canDelete) {
      await Table.query().deleteById(tableId);
      res.status(200).json({ message: 'Table deleted successfully', table });
    } else {
      throw new NotAcceptableException("Table has reservations. Cannot delete.");
    }
  } catch (error) {
    next(error);
  }
};

exports.update_table = async (req, res, next) => {
  const tableId = req.params.id;

  const { tableNo, seatingCapacity, isIndoor } = req.body;

  try {
    await Table.query().findById(tableId).throwIfNotFound({ message: 'Table does not exist.' });
    
    let canUpdate = false;
    const reservedTables = await TableUser.query().where("tableId", "=", tableId);
    if (!reservedTables.length) {
      canUpdate = true;
    }
    
    if (canUpdate) {
      const updatedTable = await Table.query().patchAndFetchById(tableId, { tableNo, seatingCapacity, isIndoor });
      res.status(200).json({ message: 'Table updated successfully', updatedTable });
    } else {
      throw new NotAcceptableException("Table has reservations. Cannot update.");
    }
  } catch (error) {
    next(error);
  }
};
