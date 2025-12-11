import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice';
import { placeOrder } from '../store/orderSlice';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import axios from 'axios';

// Initialize Stripe - we'll update this with the publishable key from the backend
let stripePromise;

// Function to get Stripe instance
const getStripe = async () => {
  if (!stripePromise) {
    // In a real app, you might want to fetch this from your backend
    stripePromise = loadStripe('your_publishable_key_here');
  }
  return stripePromise;
};


export default function Checkout() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const safeTotal = Number.isFinite(Number(total)) ? Number(total) : 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'card',
  });
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeOptions, setStripeOptions] = useState({});
  const discount = Number((appliedVoucher && appliedVoucher.discount) || 0);
  const payableTotal = Math.max(0, safeTotal - (Number.isFinite(discount) ? discount : 0));

  // Initialize Stripe and create payment intent when component mounts
  useEffect(() => {
    const initializePayment = async () => {
      try {
        setIsProcessing(true);
        
        // Create payment intent
        const response = await axios.post('https://dj-pizzaria-mern-stack.onrender.com/api/payments/create-payment-intent', {
          amount: payableTotal * 100,
          currency: 'inr',
          metadata: {
            orderId: `order_${Date.now()}`,
            userId: 'user_123' // In a real app, get this from your auth context
          }
        });

        // Update Stripe with the publishable key from the backend
        const publishableKey = response.data.publishableKey;
        setStripePromise(loadStripe(publishableKey));
        
        // Set client secret for the payment intent
        setClientSecret(response.data.clientSecret);
        
        // Set Stripe options
        setStripeOptions({
          clientSecret: response.data.clientSecret,
          appearance: {
            theme: 'stripe',
          },
        });
        
      } catch (error) {
        console.error('Error initializing payment:', error);
        setPaymentError('Failed to initialize payment. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    };
    if (items.length > 0) {
      initializePayment();
    }
  }, [items, total, payableTotal]);

  useEffect(() => {
    try {
      const v = localStorage.getItem('appliedVoucher');
      setAppliedVoucher(v ? JSON.parse(v) : null);
    } catch (e) {
      setAppliedVoucher(null);
    }
    const updateVoucher = () => {
      try {
        const v = localStorage.getItem('appliedVoucher');
        setAppliedVoucher(v ? JSON.parse(v) : null);
      } catch (e) {}
    };
    window.addEventListener('cartUpdated', updateVoucher);
    window.addEventListener('storage', updateVoucher);
    return () => {
      window.removeEventListener('cartUpdated', updateVoucher);
      window.removeEventListener('storage', updateVoucher);
    };
  }, []);

  // Ensure that when cart is empty on checkout, localStorage cart and navbar badge
  // are also cleared so Cart page and Navbar do not show stale items/count
  useEffect(() => {
    if (items.length === 0) {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const parsed = JSON.parse(user);
          const userId = parsed && parsed._id;
          if (userId) {
            localStorage.removeItem(`cart_${userId}`);
          }
        }
        localStorage.removeItem('appliedVoucher');
        try { window.dispatchEvent(new Event('cartUpdated')); } catch (e) {}
      } catch (e) {
        console.error('Error syncing empty cart state on checkout:', e);
      }
    }
  }, [items.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSuccess = async (paymentMethodId) => {
    try {
      setIsProcessing(true);
      
      // In a real app, you would send the payment method ID to your backend
      // along with the order details to complete the payment
      // const response = await fetch('/api/process-payment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     paymentMethodId,
      //     amount: total * 100, // amount in cents
      //     customer: customerInfo,
      //     items,
      //   }),
      // });
      // const result = await response.json();
      
      // For demo purposes, we'll simulate a successful payment
      const result = { success: true };
      
      if (result.success) {
        // Create order
        const route = [
          { lat: 19.076, lng: 72.8777 },
          { lat: 19.080, lng: 72.8890 },
          { lat: 19.085, lng: 72.9000 },
          { lat: 19.089, lng: 72.9120 },
          { lat: 19.095, lng: 72.9250 },
        ];
        
        const order = { 
          id: Date.now(), 
          customer: customerInfo, 
          items, 
          total: payableTotal, 
          route, 
          payment: 'card',
          paymentStatus: 'paid',
          status: 'confirmed'
        };
        
        dispatch(placeOrder(order));
        dispatch(clearCart());

        // Also clear localStorage cart so the cart icon and Cart page are in sync
        try {
          const user = localStorage.getItem('user');
          if (user) {
            const parsed = JSON.parse(user);
            const userId = parsed && parsed._id;
            if (userId) {
              localStorage.removeItem(`cart_${userId}`);
            }
          }
          localStorage.removeItem('appliedVoucher');
          try { window.dispatchEvent(new Event('cartUpdated')); } catch (e) {}
        } catch (e) {
          console.error('Error clearing local cart after payment:', e);
        }

        navigate('/confirmation');
      } else {
        setPaymentError(result.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError('An error occurred while processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="page">
        <h2>Checkout</h2>
        <p>Your cart is empty.</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h2>Checkout</h2>
      <div className="checkout-container">
        <div className="customer-info">
          <h3>Customer Information</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={customerInfo.name}
              onChange={handleInputChange}
              placeholder="John Doe" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={customerInfo.phone}
              onChange={handleInputChange}
              placeholder="+1234567890" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Delivery Address</label>
            <textarea 
              name="address" 
              value={customerInfo.address}
              onChange={handleInputChange}
              placeholder="123 Main St, City, Country" 
              rows="3"
              required 
            />
          </div>
          
          <div className="payment-method">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label className={customerInfo.paymentMethod === 'card' ? 'active' : ''}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={customerInfo.paymentMethod === 'card'}
                  onChange={handleInputChange}
                />
                <span>Credit/Debit Card</span>
              </label>
              <label className={customerInfo.paymentMethod === 'cod' ? 'active' : ''}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={customerInfo.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>
          
          {paymentError && (
            <div className="error-message">
              {paymentError}
            </div>
          )}
        </div>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-items">
            {items.map((item, index) => (
              <div key={index} className="order-item">
                <span className="item-name">{item.name} x {item.quantity}</span>
                <span className="item-price">
                  {(() => {
                    const rawPrice = typeof item.price === 'string'
                      ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
                      : Number(item.price);
                    const qty = typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : Number(item.quantity);
                    const lineTotal = (Number.isFinite(rawPrice) && Number.isFinite(qty))
                      ? rawPrice * qty
                      : 0;
                    return `$${lineTotal.toFixed(2)}`;
                  })()}
                </span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <span>Subtotal:</span>
            <span>${safeTotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="order-total">
              <span>Discount{appliedVoucher?.code ? ` (${appliedVoucher.code})` : ''}:</span>
              <span>- ${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="order-total">
            <span>Total:</span>
            <span>${payableTotal.toFixed(2)}</span>
          </div>
          
          {customerInfo.paymentMethod === 'card' ? (
            <div className="card-payment">
              {clientSecret && stripeOptions.clientSecret ? (
                <Elements stripe={stripePromise} options={stripeOptions}>
                  <PaymentForm 
                    total={payableTotal}
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={setPaymentError}
                    isProcessing={isProcessing}
                  />
                </Elements>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e31837] mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading payment form...</p>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="place-order-btn"
              onClick={() => {
                // Handle cash on delivery
                const route = [
                  { lat: 19.076, lng: 72.8777 },
                  { lat: 19.080, lng: 72.8890 },
                  { lat: 19.085, lng: 72.9000 },
                  { lat: 19.089, lng: 72.9120 },
                  { lat: 19.095, lng: 72.9250 },
                ];
                
                const order = { 
                  id: Date.now(), 
                  customer: customerInfo, 
                  items, 
                  total: payableTotal, 
                  route, 
                  payment: 'cod',
                  paymentStatus: 'pending',
                  status: 'confirmed'
                };
                
                dispatch(placeOrder(order));
                dispatch(clearCart());

                // Clear localStorage cart and notify navbar/cart icon
                try {
                  const user = localStorage.getItem('user');
                  if (user) {
                    const parsed = JSON.parse(user);
                    const userId = parsed && parsed._id;
                    if (userId) {
                      localStorage.removeItem(`cart_${userId}`);
                    }
                  }
                  localStorage.removeItem('appliedVoucher');
                  try { window.dispatchEvent(new Event('cartUpdated')); } catch (e) {}
                } catch (e) {
                  console.error('Error clearing local cart after COD order:', e);
                }
                navigate('/confirmation');
              }}
              disabled={isProcessing || !customerInfo.name || !customerInfo.phone || !customerInfo.address}
            >
              {isProcessing ? 'Processing...' : 'Place Order (Cash on Delivery)'}
            </button>
          )}
        </div>
      </div>
      
      <style>{`
        .checkout-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 2rem;
          max-width: 1040px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 1rem;
        }
        
        .customer-info, .order-summary {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 1rem;
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }
        
        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .payment-options label {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .payment-options label:hover,
        .payment-options label.active {
          border-color: #4f46e5;
          background-color: #f5f3ff;
        }
        
        .payment-options input[type="radio"] {
          margin-right: 0.75rem;
          width: auto;
        }
        
        .order-items {
          margin: 1rem 0;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1rem;
        }
        
        .order-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        
        .order-total {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          font-size: 1.125rem;
          margin: 1.5rem 0;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .place-order-btn {
          width: 100%;
          padding: 1rem;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .place-order-btn:hover:not(:disabled) {
          background-color: #4338ca;
        }
        
        .place-order-btn:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
        
        .error-message {
          color: #ef4444;
          background-color: #fef2f2;
          padding: 0.75rem;
          border-radius: 6px;
          margin-top: 1rem;
          font-size: 0.875rem;
        }
        
        @media (max-width: 768px) {
          .checkout-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-top: 1.5rem;
            padding: 0 1rem 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}
