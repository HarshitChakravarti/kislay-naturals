const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, 'Please enter shipping address']
    },
    city: {
      type: String,
      required: [true, 'Please enter shipping city']
    },
    state: {
      type: String,
      required: [true, 'Please enter shipping state']
    },
    country: {
      type: String,
      required: [true, 'Please enter shipping country'],
      default: 'India'
    },
    pinCode: {
      type: Number,
      required: [true, 'Please enter shipping pincode']
    },
    phoneNo: {
      type: String,
      required: [true, 'Please enter contact number']
    }
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
      }
    }
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
      default: 'cash_on_delivery'  // Added default
    },
    status: {
      type: String,
      required: true,
      default: 'pending'  // Added default
    }
  },
  paidAt: {
    type: Date,
    required: true,
    default: Date.now  // Added default
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'Processing'
  },
  deliveredAt: {
    type: Date
  }
}, { timestamps: true });  // Added timestamps instead of manual createdAt

module.exports = mongoose.model('Order', orderSchema);