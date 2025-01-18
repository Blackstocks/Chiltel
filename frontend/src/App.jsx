// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Blog from "./pages/Blog";
import Orders from "./pages/Orders";
import Verify from "./pages/Verify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BlogPost from "./pages/BlogPost";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServiceCollection from "./components/ServiceCollection";
import ServiceDetail from "./components/ServiceDetail";
import ProductList from "./pages/ProductList"; // Let's use just this one
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ServiceCartProvider } from "./context/ServiceCartContext";
import BuyNow from "./pages/BuyNow";
import OrderSuccess from "./pages/OrderSuccess";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
// import * as serviceWorkerRegistration from './lib/pwa/RegisterServiceWorker';
import RegisterServiceWorker from "./lib/pwa/RegisterServiceWorker";
//Vercel Analytics added

const App = () => {
  RegisterServiceWorker();
  return (
    <AuthProvider>
      <ToastContainer position="top-center" />
      <CartProvider>
        <ServiceCartProvider>
          <SpeedInsights>
            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
              <Navbar />
              <SearchBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:productId" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/place-order" element={<PlaceOrder />} />
                <Route path="/checkout" element={<BuyNow />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/services" element={<ServiceCollection />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/products/:category" element={<ProductList />} />
                <Route path="/blog/:postId" element={<BlogPost />} />
              </Routes>
              <Footer />
            </div>
            <Analytics />
          </SpeedInsights>
        </ServiceCartProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
