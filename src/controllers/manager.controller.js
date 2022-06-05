const { getAllManagers } = require("../services/manager.service");

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

module.exports = {
  getAllManagersHandler,
};
