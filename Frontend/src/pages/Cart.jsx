import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, removeFromCart } from '../store/cartSlice';
import api from '../services/api';
import '../styles/Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const voucher = localStorage.getItem('voucher');
    if (voucher) {
      try {
        const v = JSON.parse(voucher);
        if (v.code) setCode(v.code);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const s = items.reduce((a, i) => {
      const price = parseFloat(i.price) || 0;
      const qty = parseInt(i.quantity, 10) || 0;
      return a + price * qty;
    }, 0);
    setSubtotal(s);
    setTotal(applied ? Math.max(0, s - (applied.discount || 0)) : s);
  }, [items, applied]);

  const handleApply = async () => {
    if (!code) { setMessage('Enter voucher code'); return; }
    setLoading(true);
    setMessage('');
    try {
      const res = await api.applyVoucher(code);
      let discount = 0;
      if (res.voucher.type === 'BOGO') {
        const units = [];
        items.forEach(i => {
          const qty = parseInt(i.quantity, 10) || 0;
          const price = parseFloat(i.price) || 0;
          for (let k = 0; k < qty; k++) units.push(price);
        });
        units.sort((a, b) => a - b);
        discount = units.length ? units[0] : 0;
      } else if (res.voucher.type === 'PERCENT') {
        discount = Math.round(subtotal * (res.voucher.value / 100) * 100) / 100;
      } else if (res.voucher.type === 'AMOUNT') {
        discount = Math.min(subtotal, res.voucher.value);
      }
      setApplied({ code: res.voucher.code, type: res.voucher.type, discount });
      localStorage.setItem('appliedVoucher', JSON.stringify({ code: res.voucher.code, discount }));
      setMessage('Voucher applied!');
    } catch (err) {
      setMessage(err.message || 'Could not apply voucher');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id) => {
    const willBeEmpty = items.length <= 1;
    dispatch(removeFromCart(id));
    setMessage('Item removed from cart');
    setTimeout(() => setMessage(''), 2000);
    if (willBeEmpty) {
      navigate('/menu');
    }
  };

  const handleCheckout = () => {
    // Navigate to the Checkout page where Stripe payment is handled
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {message && <div className="cart-message">{message}</div>}
      <div className="cart-items">
        {items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          items.map(it => (
            <div key={it.id} className="cart-item">
              <div className="ci-left">
                <strong>{it.name}</strong>
                <div>Qty: {it.quantity}</div>
              </div>
              <div className="ci-right">
                <div>₹{((parseFloat(it.price) || 0) * (parseInt(it.quantity, 10) || 0)).toFixed(2)}</div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(it.id)}
                  style={{
                    marginTop: '6px',
                    padding: '4px 8px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '.85rem'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-actions">
        <div className="voucher-row">
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Voucher code" />
          <button onClick={handleApply} disabled={loading}>{loading? '...' : 'Apply'}</button>
        </div>

        <div className="totals">
          <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
          <div>Discount: ₹{applied ? applied.discount.toFixed(2) : '0.00'}</div>
          <div className="total">Total: ₹{total.toFixed(2)}</div>
        </div>

        <button className="checkout-btn" onClick={handleCheckout} disabled={loading || items.length===0}>
          {loading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
}
