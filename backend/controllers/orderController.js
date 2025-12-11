import Order from '../models/Order.js';
import Voucher from '../models/Voucher.js';
import { validationResult } from 'express-validator';

// Helper: compute subtotal from cart items
const computeSubtotal = (items) => {
  return items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 1), 0);
};

// Helper: compute BOGO discount (simple rule: free cheapest single unit)
const computeBogoDiscount = (items) => {
  const units = [];
  items.forEach(i => {
    for (let k=0;k<i.qty;k++) units.push(Number(i.price) || 0);
  });
  if (units.length === 0) return 0;
  units.sort((a,b) => a - b);
  // free one cheapest unit
  return units[0];
};

// Create order endpoint
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items, voucherCode, paymentMethod, idempotencyKey } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    // Compute subtotal
    const subtotal = computeSubtotal(items);
    let discount = 0;
    let appliedVoucher = null;

    // Preview voucher if provided (server authoritative)
    if (voucherCode) {
      const now = new Date();
      const voucher = await Voucher.findOne({ code: voucherCode });
      if (!voucher) return res.status(400).json({ success:false, message: 'Voucher invalid' });
      if (!voucher.isActive || voucher.used) return res.status(400).json({ success:false, message: 'Voucher not usable' });
      if (voucher.assignedTo && voucher.assignedTo.toString() !== userId) return res.status(403).json({ success:false, message: 'Voucher not assigned to this user' });
      if (voucher.expiresAt && now > voucher.expiresAt) return res.status(400).json({ success:false, message: 'Voucher expired' });

      // compute discount based on type
      if (voucher.type === 'BOGO') {
        discount = computeBogoDiscount(items);
      } else if (voucher.type === 'PERCENT') {
        discount = Math.round(subtotal * (voucher.value / 100) * 100) / 100;
      } else if (voucher.type === 'AMOUNT') {
        discount = Math.min(subtotal, voucher.value);
      }
      appliedVoucher = voucher;
    }

    const total = Math.max(0, subtotal - discount);

    // Payment simulation: if paymentMethod === 'test' we mark paid immediately and atomically mark voucher used
    if (paymentMethod === 'test') {
      // If voucher provided, atomically mark as used
      if (appliedVoucher) {
        const now = new Date();
        const updated = await Voucher.findOneAndUpdate(
          {
            code: appliedVoucher.code,
            isActive: true,
            used: false,
            $or: [ { assignedTo: userId }, { assignedTo: null } ],
            expiresAt: { $gt: now }
          },
          { $set: { used: true, isActive: false, redeemedAt: now, redeemedBy: userId } },
          { new: true }
        );

        if (!updated) {
          return res.status(400).json({ success:false, message: 'Voucher could not be redeemed (possibly used by another request)' });
        }
      }

      // Create paid order
      const order = new Order({ user: userId, items, subtotal, discount, total, voucherCode: appliedVoucher ? appliedVoucher.code : null, paymentMethod, status: 'PAID' });
      await order.save();

      return res.status(201).json({ success: true, message: 'Order created and paid', order });
    }

    // Non-instant payment: create PENDING order (voucher not redeemed yet)
    const order = new Order({ user: userId, items, subtotal, discount, total, voucherCode: appliedVoucher ? appliedVoucher.code : null, paymentMethod, status: 'PENDING' });
    await order.save();

    // Return payment intent mock
    return res.status(201).json({ success: true, message: 'Order created (pending payment)', order, paymentIntent: { id: `pi_${Date.now()}`, amount: total } });

  } catch (error) {
    console.error('Create order error:', error.message);
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};


