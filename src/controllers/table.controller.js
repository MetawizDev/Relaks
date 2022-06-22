const tableService = require("../services/table.service");
const ConflictException = require("../common/exceptions/ConflictException");
const NotAcceptableException = require("../common/exceptions/NotAcceptableException");
const socketServer = require("../configs/socketConfig");
const TableUser = require("../models/table-user.model");
const Table = require("../models/table.model");
const nodeSchedule = require("node-schedule");
const roles = require("../models/roles");

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
        tableName: req.body.tableName,
        isIndoor: req.body.isIndoor,
        seatingCapacity: req.body.seatingCapacity,
      };
      // Check for existing table
      if (await tableService.getTable("tableName", data.tableName)) throw new ConflictException("Table already exists!");

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

exports.getAllReservationsHandler = () => {
  return async (req, res, next) => {
    try {
      let reservedTables;
      if (req.user.role === roles.MANAGER || req.user.role === roles.OWNER) {
        // Get all reserved tables
        reservedTables = await tableService.getAllReservationsWithUser();
      }
      if (req.user.role === roles.CUSTOMER) {
        reservedTables = await tableService.getAllReservationsOfUser(req.user.id);
      }

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

exports.getAvailableTablesByTimeHandler = () => {
  return async (req, res, next) => {
    try {
      checkIn = new Date(req.body.checkIn);
      checkOut = new Date(req.body.checkOut);

      // Get all reserved tables
      const reservations = await tableService.getAllReservations();

      // Get all tables
      let allTables = await tableService.getAllTables();
      let allTableIds = allTables.map((table) => table.id);

      allTableIds.forEach((tableId) => {
        let availability = [];

        const tableReservations = reservations.filter((reservation) => reservation.tableId === tableId);

        tableReservations.forEach((reservation) => {
          if (checkOut < reservation.checkIn || reservation.checkOut < checkIn || checkIn.getTime() === reservation.checkOut.getTime() || checkOut.getTime() === reservation.checkIn.getTime()) {
            availability.push(true);
          } else {
            availability.push(false);
          }
        });
        if (availability.includes(false)) {
          allTables = allTables.filter((table) => table.id != tableId);
        }
      });

      res.status(200).json({
        message: "Fetched available tables sucessfully!",
        success: true,
        data: { availableTableIds: allTables },
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

    const values = [];
    for (const { id, checkIn: tableCheckIn, checkOut: tableCheckOut } of reservedTables) {
      if (checkOut < tableCheckIn || tableCheckOut < checkIn || checkIn.getTime() === tableCheckOut.getTime() || checkOut.getTime() === tableCheckIn.getTime()) {
        // available
        values.push(true);
      } else {
        values.push(false);
      }
    }

    canReserve = !values.includes(false);

    if (canReserve) {
      const data = await TableUser.query().insertAndFetch({ userId, tableId, checkIn, checkOut, note });
      const date = new Date(checkIn.setMinutes(checkIn.getMinutes() + 15));
      const job = nodeSchedule.scheduleJob(date, async () => {
        const deletedData = await TableUser.query().deleteById(data.id);
        delete scheduledJobs[data.id];
        console.log(scheduledJobs);
        socketServer.emitToRoom(req.user.username, "table-reserve", { data: `Table reservation cancelled`, tableId });
      });
      scheduledJobs[data.id] = job;
      console.log(scheduledJobs);

      socketServer.emitToRoom(roles.MANAGER, "table-reserve", { data: `Table reservation for table id ${tableId}` });
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
    const table = await Table.query().findById(tableId).throwIfNotFound({ message: "Table does not exist." });

    let canDelete = false;
    const reservedTables = await TableUser.query().where("tableId", "=", tableId);
    if (!reservedTables.length) {
      canDelete = true;
    }

    if (canDelete) {
      await Table.query().deleteById(tableId);
      res.status(200).json({ message: "Table deleted successfully", table });
    } else {
      throw new NotAcceptableException("Table has reservations. Cannot delete.");
    }
  } catch (error) {
    next(error);
  }
};

exports.update_table = async (req, res, next) => {
  const tableId = req.params.id;

  const { tableName, seatingCapacity, isIndoor } = req.body;

  try {
    await Table.query().findById(tableId).throwIfNotFound({ message: "Table does not exist." });

    let canUpdate = false;
    const reservedTables = await TableUser.query().where("tableId", "=", tableId);
    if (!reservedTables.length) {
      canUpdate = true;
    }

    if (canUpdate) {
      const updatedTable = await Table.query().patchAndFetchById(tableId, { tableName, seatingCapacity, isIndoor });
      res.status(200).json({ message: "Table updated successfully", updatedTable });
    } else {
      throw new NotAcceptableException("Table has reservations. Cannot update.");
    }
  } catch (error) {
    next(error);
  }
};

exports.update_reservation_status = async (req, res, next) => {
  const reservationId = req.params.id;

  try {
    const reservation = await TableUser.query().findById(reservationId).throwIfNotFound({ message: "Reservation does not exist." });

    const date = new Date(reservation.checkOut);

    scheduledJobs[reservationId].cancel();
    delete scheduledJobs[reservationId];

    const job = nodeSchedule.scheduleJob(date, async () => {
      console.log("deleting reservation ", reservationId);
      await TableUser.query().deleteById(reservationId);
    });

    res.status(200).json({
      data: "Successfully updated reservation status.",
    });
  } catch (error) {
    next(error);
  }
};
