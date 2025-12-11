import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, default: 1 }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  voucherCode: { type: String, default: null },
  paymentMethod: { type: String, default: 'test' },
  status: { type: String, enum: ['PENDING','PAID','CANCELLED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
