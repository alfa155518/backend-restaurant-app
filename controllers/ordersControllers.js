const jwt = require('jsonwebtoken');
const Orders = require('../models/ordersModel');
const User = require('../models/userModel');
const errorsControllers = require('../controllers/errorsControllers');
const { sendMail } = require('../utils/mail');
const emailContent = require('../utils/emailContent');
const paymentControllers = require('../controllers/paymentControllers');
const dynamicProductType = require('../utils/dynamicProductType');
// Create a new Order
const createOrder = async (req, res) => {
  // 1) get token and verify token to get user ID
  const token = await req.headers.authorization.split(' ')[1];

  const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

  const customerId = await decoded.data;

  const { productId, quantity } = await req.body;

  // Identify Product Type
  const type = await dynamicProductType(productId);

  const checkoutUrl = await paymentControllers
    .checkoutOrder(req, res, productId, quantity)
    .then((data) => {
      return data.url;
    });

  const newOrder = await Orders.create({
    productType: type,
    product: productId,
    customer: customerId,
    quantity,
  });

  const order = await Orders.find(newOrder._id).populate('product');

  const user = await User.findById(customerId);

  // 2) Send email to customer
  await sendMail(
    user.email,
    'You ordered New Order 💥',
    emailContent.newOrderEmailContent(user, order[0])
  );

  try {
    res.status(201).json({
      status: 'success',
      newOrder,
      checkoutUrl,
    });
  } catch (err) {
    errorsControllers.globalErrorHandler(res, 400, err);
  }
};

// get all orders
const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Orders.find().populate('product').populate({
      path: 'customer',
      select: 'firstName  phone email',
    });
    res.status(200).json({
      status: 'success',
      allOrders,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Server error',
    });
  }
};

// Update order Status
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = await req.params.orderId;

    // check order already exists in database
    const targetOrder = await Orders.findById(orderId);

    if (!targetOrder) {
      return errorsControllers.dataNotExit(res, 404, 'Order not found');
    }

    const updatedOrder = await Orders.findByIdAndUpdate(orderId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      updatedOrder,
    });
  } catch (err) {
    errorsControllers.globalErrorHandler(res, 400, err);
  }
};

// Delete order

const deleteOrder = async (req, res) => {
  try {
    const orderId = await req.params.orderId;

    // check order already exists in database
    const targetOrder = await Orders.findById(orderId);

    if (!targetOrder) {
      return errorsControllers.dataNotExit(res, 404, 'Order not found');
    }

    await Orders.findByIdAndDelete(orderId);

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    errorsControllers.globalErrorHandler(res, 400, err);
  }
};

module.exports = { createOrder, getAllOrders, updateOrderStatus, deleteOrder };
