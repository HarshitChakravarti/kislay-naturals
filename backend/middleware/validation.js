// middleware/validation.js
const { body } = require('express-validator');

exports.validateOrderCreation = [
  body('orderItems').isArray({ min: 1 }).withMessage('At least one order item is required'),
  body('orderItems.*.product').isMongoId().withMessage('Invalid product ID'),
  body('orderItems.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingInfo.address').notEmpty().withMessage('Address is required'),
  body('shippingInfo.city').notEmpty().withMessage('City is required'),
  body('shippingInfo.state').notEmpty().withMessage('State is required'),
  body('shippingInfo.pinCode').isInt().withMessage('Pin code must be a number'),
  body('shippingInfo.phoneNo').isMobilePhone().withMessage('Invalid phone number'),
  body('paymentInfo.id').notEmpty().withMessage('Payment ID is required'),
  body('paymentInfo.status').isIn(['pending', 'completed']).withMessage('Invalid payment status')
];