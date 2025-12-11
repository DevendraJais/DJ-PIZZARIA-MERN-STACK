import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['BOGO','PERCENT','AMOUNT'],
    default: 'BOGO'
  },
  value: {
    // For PERCENT/AMOUNT vouchers
    type: Number,
    default: 0
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  used: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Voucher', voucherSchema);
