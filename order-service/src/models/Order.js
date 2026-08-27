const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    productId: { type: String, required: true },
    userSnapshot: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      city: { type: String },
    },
    productSnapshot: {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      categoryName: { type: String, required: true },
    },
    price: { type: Number, required: true },
    conversationId: { type: String, required: true, unique: true },
    token: { type: String, index: true },
    paymentId: { type: String },
    failureReason: { type: String },
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);
