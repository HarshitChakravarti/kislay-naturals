const express = require('express');
const {
  createOrder,
  getMyOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { validateOrderCreation } = require('../middleware/validation'); // New validation middleware

const router = express.Router();

// Apply protection to all routes
router.use(protect);

router.route('/')
  .post(
    validateOrderCreation, // Add order validation middleware
    createOrder
  )
  .get(getMyOrders);

// Add route for getting order by ID
router.route('/:id')
  .get(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (err) {
      next(err);
    }
  });

module.exports = router;