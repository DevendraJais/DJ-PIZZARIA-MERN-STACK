import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./store/cartSlice";
import orderReducer from "./store/orderSlice";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartBanner from "./components/CartBanner";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import Confirmation from "./pages/Confirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Category from "./pages/Category";
import OrderMode from "./pages/OrderMode";
import SearchResults from "./pages/SearchResults";
import "./styles.css";

const store = configureStore({
reducer: {
cart: cartReducer,
order: orderReducer,
},
});

function AnimatedRoutes(){
const location = useLocation();
return (
<AnimatePresence mode="wait">
<motion.main key={location.pathname} style={{ minHeight:'70vh' }}
 initial={{ opacity:0, y:8 }}
 animate={{ opacity:1, y:0 }}
 exit={{ opacity:0, y:-8 }}
 transition={{ duration:.25 }}>
<Routes location={location}>
<Route path="/" element={<Home />} />
<Route path="/menu" element={<Menu />} />
<Route path="/category/:slug" element={<Category />} />
<Route path="/order/:mode" element={<OrderMode />} />
<Route path="/search" element={<SearchResults />} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/cart" element={<Cart />} />
<Route path="/checkout" element={<Checkout />} />
<Route path="/track" element={<OrderTracking />} />
<Route path="/confirmation" element={<Confirmation />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
</Routes>
</motion.main>
</AnimatePresence>
);
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

function AppContent() {
  const location = useLocation();
  const hideFooter =
    location.pathname === '/cart' ||
    location.pathname === '/search' ||
    location.pathname === '/login' ||
    location.pathname === '/register';

  return (
    <>
      <Navbar />
      <AnimatedRoutes />
      <CartBanner />
      {!hideFooter && <Footer />}
    </>
  );
}