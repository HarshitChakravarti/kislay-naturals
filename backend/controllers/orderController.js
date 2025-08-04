const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,  // Changed from shippingAddress to match schema
    paymentInfo,   // Added to match schema
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(new ErrorResponse('No order items', 400));
  }

  // Create order items with data from the database
  const itemsFromDB = await Promise.all(
    orderItems.map(async (item) => {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        throw new ErrorResponse(`Product not found with id ${item.product}`, 404);
      }
      return {
        name: dbProduct.name,
        quantity: item.quantity,  // Changed from qty to match schema
        image: dbProduct.images[0],
        price: dbProduct.price,
        product: item.product,
      };
    })
  );

  const order = new Order({
    orderItems: itemsFromDB,
    user: req.user._id,
    shippingInfo,  // Changed to match schema
    paymentInfo,   // Added to match schema
    itemsPrice: itemsFromDB.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    taxPrice: taxPrice || 0.15 * itemsPrice,
    shippingPrice: shippingPrice || (itemsPrice > 100 ? 0 : 10),
    totalPrice: totalPrice || (itemsPrice + (itemsPrice * 0.15) + (itemsPrice > 100 ? 0 : 10)),
    paidAt: new Date(),  // Automatically set paidAt
    orderStatus: 'Processing'  // Set default status
  });

  const createdOrder = await order.save();
  
  res.status(201).json({
    success: true,
    order: createdOrder,
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});