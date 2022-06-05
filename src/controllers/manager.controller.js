const { getAllManagers, deleteManager } = require("../services/manager.service");
const { getUser } = require("../services/auth.service");
const ConflictException = require("../common/exceptions/ConflictException");
const roles = require("../models/roles");

const getAllManagersHandler = () => {
  return async (req, res, next) => {
    try {
      const managers = await getAllManagers();

      res.status(200).json({
        message: "Managers fetched successfuly!",
        success: true,
        data: managers,
      });
    } catch (error) {
      next(error);
    }
  };
};

const deleteManagerHandler = () => {
  return async (req, res, next) => {
    try {
      const managerId = req.params.id;

      // Get the user with mangerId
      const manager = await getUser("id", managerId);

      // Check of user role is manager or manager exist
      if (!manager || manager.role != roles.MANAGER) throw new ConflictException("Manager does not exist!");

      // Delete manager
      await deleteManager(managerId);

      res.status(200).json({
        message: "Managers deleted successfuly!",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  getAllManagersHandler,
  deleteManagerHandler,
};
