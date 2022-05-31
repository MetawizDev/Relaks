const { NotFoundError } = require("objection");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const FoodItem = require("../models/food-item.model");
const authService = require('../services/auth.service');
const NotFoundException = require("../common/exceptions/NotFoundException");
const orderStatus = require('../models/orderStatus');
const roles = require('../models/roles');
const ValidationException = require("../common/exceptions/ValidationException");

exports.create_order = async (req, res, next) => {
  const userId = req.user.id;

  const { isDelivery, noOfItems, totalPrice, location, foodItems } = req.body;
  const { latitude, longitude } = location;
  const status = orderStatus.PENDING; // default status of an order when creating

  // checking if fooditem ids are valid
  for(const { id } of foodItems) {
    try {
      const foodItem = await FoodItem.query().findById(id);
      const message = `Food item for id ${id} does not exist`;
      if(!foodItem) throw new NotFoundException(message);      
    } catch (error) {
      next(error);
      return;
    }
  }

  try {
    // populating from user side
    const order = await User.relatedQuery('orders').for(userId).insert({ isDelivery, noOfItems, totalPrice, latitude, longitude, status });
    // making a relation from food item side
    for(const { id, quantity } of foodItems) {
      await FoodItem.relatedQuery('orders').for(id).relate({id: order.id, quantity});
    }
    res.status(201).json({
      message: "Order created successfully",
      success: true,
      data: order,
    });
    
  } catch (error) {
    next(error);
  }
};

exports.get_all_orders = async (req, res, next) => {
  const status = req.query.status;
  const { id, role } = req.user;

  if(role === roles.CUSTOMER) {
    if(status) {
      Order.query()
        .where('userId', '=', id)
        .where('status', '=', status)
        .withGraphFetched('[foodItems]')
        .then((result) => {
          res.status(200).json({
            count: result.length,
            data: result,
          });
        })
        .catch((error) => {
          next(error);
        });
    } else {
      Order.query().where('userId', '=', id)
        .withGraphFetched('[foodItems]')
        .then((result) => {
          res.status(200).json({
            count: result.length,
            data: result,
          });
        })
        .catch((error) => {
          next(error);
        });
    }
  } else if (role === roles.MANAGER || role === roles.OWNER) {
    if(status) {
      Order.query()
        .where('status', '=', status)
        .withGraphFetched('[foodItems]')
        .then((result) => {
          res.status(200).json({
            count: result.length,
            data: result,
          });
        })
        .catch((error) => {
          next(error);
        });
    } else {
      Order.query()
      .withGraphFetched('[foodItems]')
      .then((result) => {
        res.status(200).json({
          count: result.length,
          data: result,
        });
      })
      .catch((error) => {
        next(error);
      });
    }
  }

};

exports.update_order_status = async (req, res, next) => {
  const id = req.params.orderId;

  const newStatus = req.body.status;

  const { status: oldStatus } = await Order.query()
                        .findById(id)
                        .throwIfNotFound({ message: "Order does not exist" });

  let isValidTransition = false;
  if(oldStatus === orderStatus.PENDING && 
    (newStatus === orderStatus.ACCEPTED || newStatus === orderStatus.CANCELLED)) {
      isValidTransition = true;
  } else if(oldStatus === orderStatus.ACCEPTED && 
    (newStatus === orderStatus.COMPLETED || newStatus === orderStatus.CANCELLED)) {
      isValidTransition = true;
  } 

  if(isValidTransition) {
    Order.query()
      .patchAndFetchById(id, { newStatus })
      .withGraphFetched('[foodItems]')
      .then((data) => {
        res.status(200).json({
          message: "Order updated successfully",
          data,
        });
      })
      .catch((error) => {
        next(error);
      });
  } else {
    throw new ValidationException(`Invalid status. Cannot transition from ${oldStatus} to ${newStatus}`)
  }


};