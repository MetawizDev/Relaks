const { NotFoundError } = require("objection");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const FoodItem = require("../models/food-item.model");
const Portion = require("../models/portion.model");
const OrderFooditemPortion = require("../models/order-foodItem-portion.model");
const authService = require('../services/auth.service');
const NotFoundException = require("../common/exceptions/NotFoundException");
const orderStatus = require('../models/orderStatus');
const roles = require('../models/roles');
const NotAcceptableException = require("../common/exceptions/NotAcceptableException");

exports.create_order = async (req, res, next) => {
  const userId = req.user.id;

  const { isDelivery, noOfItems, totalPrice, location, foodItems } = req.body;
  const { latitude, longitude } = location;
  const status = orderStatus.PENDING; // default status of an order when creating

  // checking if fooditem ids and portion ids are valid
  for (const { id, portionId } of foodItems) {
    try {
      const foodItem = await FoodItem.query().findById(id);
      let message = `Food item for id ${id} does not exist`;
      if (!foodItem) throw new NotFoundException(message);

      const portion = await Portion.query().findById(portionId);
      message = `Portion for id ${id} does not exist`;
      if (!portion) throw new NotFoundException(message);
    } catch (error) {
      next(error);
      return;
    }
  }

  try {
    // populating from user side
    const order = await User.relatedQuery('orders').for(userId).insert({ isDelivery, noOfItems, totalPrice, latitude, longitude, status });
    // making a relation to the join table
    const orderId = order.id;
    for (const { id: foodItemId, quantity, portionId } of foodItems) {
      await OrderFooditemPortion.query().insert({ orderId, foodItemId, portionId, quantity });
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
  let orders;

  if (role === roles.CUSTOMER) {
    if (status) {
      orders = await Order.query()
        .where('userId', '=', id)
        .where('status', '=', status);
    } else {
      orders = await Order.query()
        .where('userId', '=', id);
    }
  } else if (role === roles.MANAGER || role === roles.OWNER) {
    if (status) {
      orders = await Order.query()
        .where('status', '=', status);
    } else {
      orders = await Order.query()
    }
  }

  try {
    let data = [];
    for (const order of orders) {
      const fooditems = await OrderFooditemPortion.query()
        .select('foodItemId', 'portionId', 'quantity')
        .where('order_id', order.id)
      const result = { ...order, foodItems: [...fooditems] }
      data.push(result);
    }

    res.status(200).json({
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.update_order_status = async (req, res, next) => {
  const id = req.params.orderId;

  const newStatus = req.body.status;

  try {
    const { status: oldStatus } = await Order.query()
      .findById(id)
      .throwIfNotFound({ message: "Order does not exist" });

    let isValidTransition = false;
    if (oldStatus === orderStatus.PENDING &&
      (newStatus === orderStatus.ACCEPTED || newStatus === orderStatus.CANCELLED)) {
      isValidTransition = true;
    } else if (oldStatus === orderStatus.ACCEPTED &&
      (newStatus === orderStatus.COMPLETED || newStatus === orderStatus.CANCELLED)) {
      isValidTransition = true;
    }

    if (isValidTransition) {
      Order.query()
        .patchAndFetchById(id, { status: newStatus })
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
      throw new NotAcceptableException(`Invalid status. Cannot transition from ${oldStatus} to ${newStatus}`)
    }
  } catch (error) {
    next(error);
  }


};