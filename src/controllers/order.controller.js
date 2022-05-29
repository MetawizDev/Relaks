const { NotFoundError } = require("objection");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const FoodItem = require("../models/food-item.model");
const authService = require('../services/auth.service');
const NotFoundException = require("../common/exceptions/NotFoundException");

exports.create_order = async (req, res, next) => {
  req.user = {id: 1};

  const userId = req.user.id;

  const { type, noOfItems, totalPrice, location, status, foodItems } = req.body;

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
    let order = await User.relatedQuery('orders').for(userId).insert({ type, noOfItems, totalPrice, location, status });
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
  Order.query().withGraphFetched('[foodItems]')
    .then((result) => {
      res.status(200).json({
        count: result.length,
        data: result,
      });
    })
    .catch((error) => {
      next(error);
    });
};

exports.update_order_status = async (req, res, next) => {
  const id = req.params.orderId;

  const status = req.body.status;

  Order.query()
    .patchAndFetchById(id, { status })
    .withGraphFetched('[foodItems]')
    .throwIfNotFound({ message: "Order does not exist" })
    .then((data) => {
      res.status(200).json({
        message: "Order updated successfully",
        data,
      });
    })
    .catch((error) => {
      next(error);
    });

};