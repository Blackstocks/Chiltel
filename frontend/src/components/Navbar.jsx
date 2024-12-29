import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    setToken,
    setCartItems,
  } = useContext(ShopContext);
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout, token } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setUserId(user?._id);
  }, [loading]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [visible]);

  const toggleMenu = () => {
    setVisible(!visible);
  };

  return (
    <div className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-white/70' : 'bg-white'}`}>
      <div className="flex items-center justify-between px-4 py-4 mx-auto font-medium">
        <Link to="/" className="flex items-center">
          <img src="/assets/logoc.png" className="w-32 md:w-36" alt="Chill Mart Logo" />
        </Link>

        <ul className="hidden gap-8 text-sm text-gray-700 sm:flex">
          <NavLink to="/" className="flex flex-col items-center group">
            <p className="transition-colors hover:text-blue-600">HOME</p>
            <div className="w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></div>
          </NavLink>
          <NavLink to="/collection" className="flex flex-col items-center group">
            <p className="transition-colors hover:text-blue-600">CHILL MART</p>
            <div className="w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></div>
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center group">
            <p className="transition-colors hover:text-blue-600">ABOUT</p>
            <div className="w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></div>
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center group">
            <p className="transition-colors hover:text-blue-600">CONTACT</p>
            <div className="w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></div>
          </NavLink>
          <NavLink to="/blog" className="flex flex-col items-center group">
            <p className="transition-colors hover:text-blue-600">BLOG</p>
            <div className="w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></div>
          </NavLink>
        </ul>

        <div className="flex items-center gap-6">
          <div className="relative z-50 group">
            <img
              onClick={() => (token ? null : navigate("/login"))}
              className="w-6 cursor-pointer"
              src={assets.profile_icon}
              alt="Profile"
            />
            <div className="absolute right-0 hidden w-48 pt-2 group-hover:block dropdown-menu">
              <div className="bg-white border border-gray-100">
                <div className="flex flex-col divide-y divide-gray-100">
                  {/* <p 
                    className="px-4 py-2 text-gray-600 transition-colors cursor-pointer hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => navigate('/')}
                  >
                    My Profile
                  </p> */}
                  <p 
                    onClick={() => navigate("/orders")} 
                    className="px-4 py-2 text-gray-600 transition-colors cursor-pointer hover:bg-gray-50 hover:text-blue-600"
                  >
                    Orders
                  </p>
                  {token ? (
                    <p 
                      onClick={logout} 
                      className="px-4 py-2 text-gray-600 transition-colors cursor-pointer hover:bg-gray-50 hover:text-blue-600"
                    >
                      Logout
                    </p>
                  ) : (
                    <p 
                      onClick={() => navigate('/login')} 
                      className="px-4 py-2 text-gray-600 transition-colors cursor-pointer hover:bg-gray-50 hover:text-blue-600"
                    >
                      Login
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-6" alt="Cart" />
            <div className="absolute px-2 py-1 text-xs font-semibold text-white transform -translate-x-1/2 bg-blue-600 rounded-full -bottom-3 left-1/2">
              {cartCount}
            </div>
          </Link>
          
          <img
            onClick={toggleMenu}
            src={assets.menu_icon}
            className="w-6 cursor-pointer sm:hidden"
            alt="Menu"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[250px] bg-white transform transition-transform duration-300 ease-in-out overflow-y-auto sm:hidden ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col min-h-screen">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={toggleMenu} className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col">
            <NavLink
              onClick={toggleMenu}
              className={({ isActive }) => 
                `px-4 py-3 text-gray-600 border-b border-gray-100 ${isActive ? 'text-blue-600' : ''} hover:bg-gray-50`
              }
              to="/"
            >
              HOME
            </NavLink>
            <NavLink
              onClick={toggleMenu}
              className={({ isActive }) => 
                `px-4 py-3 text-gray-600 border-b border-gray-100 ${isActive ? 'text-blue-600' : ''} hover:bg-gray-50`
              }
              to="/collection"
            >
              COLLECTION
            </NavLink>
            <NavLink
              onClick={toggleMenu}
              className={({ isActive }) => 
                `px-4 py-3 text-gray-600 border-b border-gray-100 ${isActive ? 'text-blue-600' : ''} hover:bg-gray-50`
              }
              to="/about"
            >
              ABOUT
            </NavLink>
            <NavLink
              onClick={toggleMenu}
              className={({ isActive }) => 
                `px-4 py-3 text-gray-600 border-b border-gray-100 ${isActive ? 'text-blue-600' : ''} hover:bg-gray-50`
              }
              to="/contact"
            >
              CONTACT
            </NavLink>
            <NavLink
              onClick={toggleMenu}
              className={({ isActive }) => 
                `px-4 py-3 text-gray-600 border-b border-gray-100 ${isActive ? 'text-blue-600' : ''} hover:bg-gray-50`
              }
              to="/blog"
            >
              BLOG
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {visible && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
};

export default Navbar;