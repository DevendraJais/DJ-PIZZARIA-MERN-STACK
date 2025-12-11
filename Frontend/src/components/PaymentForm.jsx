import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
      ':-webkit-autofill': {
        color: '#32325d',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
};

export default function PaymentForm({ total, clientSecret, onSuccess, onError, isProcessing: parentIsProcessing }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret || isProcessing || parentIsProcessing) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Confirm the card payment using the CardElement and clientSecret
      const cardElement = elements.getElement(CardElement);

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        throw stripeError;
      }

      if (paymentIntent.status === 'succeeded') {
        // In a real app, you would send the payment intent ID to your server
        // to confirm the payment and update the order status
        onSuccess(paymentIntent.id);
      } else {
        throw new Error('Payment was not successful. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error.message || 'An error occurred while processing your payment.';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form-container max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="form-row bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <CardElement 
            options={CARD_ELEMENT_OPTIONS}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31837] focus:border-transparent transition-all duration-150"
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={!stripe || isProcessing || parentIsProcessing}
          className={`w-full py-3.5 px-4 rounded-full font-semibold text-white text-sm tracking-wide shadow-md transform transition-all duration-200 flex items-center justify-center gap-2 ${
            !stripe || isProcessing || parentIsProcessing
              ? 'bg-gray-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-[#e31837] to-[#ff4d4f] hover:from-[#c1121f] hover:to-[#e31837] hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {isProcessing || parentIsProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing payment...
            </span>
          ) : (
            <>
              <span>
                Pay ${total.toFixed(2)}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] uppercase">
                <span className="w-5 h-3 rounded-sm bg-white/20"></span>
                <span className="w-5 h-3 rounded-sm bg-white/30"></span>
                <span className="w-5 h-3 rounded-sm bg-white/40"></span>
              </span>
            </>
          )}
        </button>
        
        <p className="text-[11px] text-gray-500 text-center mt-1">
          Your payment is secured with 256-bit SSL encryption. We do not store your card details.
        </p>
      </form>
      <style>{`
        /* Customize Stripe Elements styling */
        .StripeElement {
          box-sizing: border-box;
          height: 48px;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background-color: white;
          transition: all 0.2s ease-in-out;
        }
        
        .StripeElement--focus {
          box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1);
          border-color: #e31837;
        }
        
        .StripeElement--invalid {
          border-color: #ef4444;
        }
        
        .StripeElement--webkit-autofill {
          background-color: #fef9c3 !important;
        }
      `}</style>
    </div>
  );
}
