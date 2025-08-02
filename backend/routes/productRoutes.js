const express = require('express');
const {
  getProducts,
  createProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.route('/')
  .get(getProducts);

// Protected routes (Admin only)
router.use(protect, authorize('admin'));
router.route('/')
  .post(createProduct);

module.exports = router;
