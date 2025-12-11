import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


export default function Confirmation(){
const order = useSelector(s => s.order.lastOrder);
if (!order) return (
  <section className="page flex items-center justify-center">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
      <h2 className="text-2xl font-semibold mb-2">Order Confirmation</h2>
      <p className="text-gray-600 mb-4">No recent order was found.</p>
      <Link 
        to="/menu" 
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#e31837] text-white text-sm font-medium hover:bg-[#c1121f] transition-colors"
      >
        Browse menu
      </Link>
    </div>
  </section>
);


return (
  <section className="page flex items-center justify-center">
    <div className="max-w-xl w-full bg-white rounded-3xl shadow-lg p-8 md:p-10">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-green-50 text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293A1 1 0 006.293 10.707l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-1">Thank you — your order is confirmed!</h2>
        <p className="text-gray-600 text-sm">We’re getting your food ready. You can track the delivery in real time.</p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wide text-gray-500">Order ID</span>
          <span className="text-sm font-mono font-semibold">#{order.id}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-left">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Customer</p>
            <p className="font-medium">{order.customer.name}</p>
            <p className="text-gray-600 text-xs mt-1 break-words">{order.customer.address}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Payment</p>
            <p className="font-medium capitalize">{order.payment === 'card' ? 'Card payment' : 'Cash on delivery'}</p>
            <p className="text-gray-600 text-xs mt-1">Status: {order.paymentStatus}</p>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-200 mt-4 pt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Order total</span>
          <span className="text-lg font-semibold text-gray-900">$ {order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link 
          to="/track" 
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#e31837] text-white text-sm font-medium hover:bg-[#c1121f] transition-colors"
        >
          Track order
        </Link>
        <Link 
          to="/menu" 
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back to menu
        </Link>
      </div>
    </div>
  </section>
);
}