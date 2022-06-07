const { getTable, createTable, reserveTable, getAvailableTables, getReservedTables, updateTable, deleteTable } = require("../services/table.service");
const ConflictException = require("../common/exceptions/ConflictException");
const NotFoundException = require("../common/exceptions/NotFoundException");
const NotAcceptableException = require("../common/exceptions/NotAcceptableException");

const getTablesHandler = () => {
  return async (req, res, next) => {
    try {
      const isReserved = req.query.reserved;

      let tables;

      if (!isReserved) {
        const reservedTables = await getReservedTables();
        const availableTables = await getAvailableTables();

        reservedTables.forEach((table) => (table.isAvailable = false));
        availableTables.forEach((table) => (table.isAvailable = true));

        tables = [...reservedTables, ...availableTables];
      } else if (isReserved === "true") {
        const reservedTables = await getReservedTables();

        reservedTables.forEach((table) => (table.isAvailable = false));

        tables = reservedTables;
      } else if (isReserved === "false") {
        const availableTables = await getAvailableTables();

        availableTables.forEach((table) => (table.isAvailable = true));

        tables = availableTables;
      } else throw new NotAcceptableException("Invalid query parameter!");

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

const createTableHandler = () => {
  return async (req, res, next) => {
    try {
      // Check for existing table
      if (await getTable("tableNo", req.body.tableNo)) throw new ConflictException("Table already exists!");

      // Create table
      const table = await createTable(req.body);

      res.status(201).json({
        message: "Table created successfuly!",
        success: true,
        data: table,
      });
    } catch (error) {
      next(error);
    }
  };
};

const reserveTableHandler = () => {
  return async (req, res, next) => {
    try {
      userId = req.user.id;
      tableId = req.body.id;

      // Check for valid table
      let table = await getTable("id", tableId);
      if (!table) throw new NotFoundException("Table not found!");

      // Check if table is available
      const availableTables = await getAvailableTables();
      const availableTableIds = availableTables.map((table) => {
        return table.id;
      });
      if (!availableTableIds.includes(tableId)) throw new ConflictException("Table already reserved!");

      // Create table
      table = await reserveTable(tableId, userId);

      res.status(200).json({
        message: "Table reserved successfuly!",
        success: true,
        data: table,
      });
    } catch (error) {
      next(error);
    }
  };
};

const updateTableHandler = () => {
  return async (req, res, next) => {
    try {
      tableId = parseInt(req.params.id);

      if (isNaN(tableId) | (tableId <= 0)) throw new NotAcceptableException("Table id should be a positive interger!");

      // Check for valid table
      if (!(await getTable("id", tableId))) throw new NotFoundException("Table not found!");

      // Check for existing table
      if (await getTable("tableNo", req.body.tableNo)) throw new ConflictException("Table already exists!");

      // Check if table is available
      const reservedTables = await getReservedTables();
      const reservedTablesIds = reservedTables.map((table) => {
        return table.id;
      });
      if (reservedTablesIds.includes(tableId)) throw new NotAcceptableException("Cannot update a reserved table!");

      // Update table
      const table = await updateTable(tableId, req.body);

      res.status(200).json({
        message: "Table updated successfuly!",
        success: true,
        data: table,
      });
    } catch (error) {
      next(error);
    }
  };
};

const deleteTableHandler = () => {
  return async (req, res, next) => {
    try {
      tableId = parseInt(req.params.id);

      if (isNaN(tableId) | (tableId <= 0)) throw new NotAcceptableException("Table id should be a positive interger!");

      // Check for valid table
      if (!(await getTable("id", tableId))) throw new NotFoundException("Table not found!");

      // Check if table is available
      const reservedTables = await getReservedTables();
      const reservedTablesIds = reservedTables.map((table) => {
        return table.id;
      });
      if (reservedTablesIds.includes(tableId)) throw new NotAcceptableException("Cannot delete a reserved table!");

      // Delete table
      const table = await deleteTable(tableId);

      res.status(200).json({
        message: "Table deleted successfuly!",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  createTableHandler,
  getTablesHandler,
  updateTableHandler,
  reserveTableHandler,
  deleteTableHandler,
};
