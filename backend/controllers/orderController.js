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
    shippingAddress,
    paymentMethod,
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
      return {
        name: dbProduct.name,
        qty: item.qty,
        image: dbProduct.images[0],
        price: dbProduct.price,
        product: item.product,
      };
    })
  );

  // Calculate prices
  const calculatedPrices = {
    itemsPrice: itemsFromDB.reduce((acc, item) => acc + item.price * item.qty, 0),
    taxPrice: 0.15, // 15% tax
    shippingPrice: itemsPrice > 100 ? 0 : 10, // Free shipping over $100
  };
  
  calculatedPrices.totalPrice = (
    calculatedPrices.itemsPrice +
    calculatedPrices.taxPrice +
    calculatedPrices.shippingPrice
  );

  const order = new Order({
    orderItems: itemsFromDB,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    ...calculatedPrices,
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
