const express = require('express');
const {
  createOrder,
  getMyOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getMyOrders);

module.exports = router;
