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
    <>
      <div className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-white/70' : 'bg-white'}`}>
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
      </div>

      {/* Mobile Menu - Fixed position relative to viewport */}
      <div 
        className={`fixed inset-0 z-50 sm:hidden transition-transform duration-300 ${
          visible ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            visible ? 'opacity-30' : 'opacity-0'
          }`}
          onClick={toggleMenu}
        ></div>
        
        {/* Menu Panel */}
        <div className="fixed top-0 right-0 w-64 h-full overflow-y-auto bg-white shadow-xl">
          <div className="p-4">
            <button 
              onClick={toggleMenu} 
              className="mb-6 text-gray-500 hover:text-gray-700"
            >
              ✕ Close
            </button>
            <nav className="space-y-1">
              <NavLink to="/" 
                className={({isActive}) => `block py-2 px-4 ${isActive ? 'text-blue-600' : 'text-gray-600'} hover:bg-gray-50 hover:text-blue-600`}
                onClick={toggleMenu}
              >
                HOME
              </NavLink>
              <NavLink to="/collection" 
                className={({isActive}) => `block py-2 px-4 ${isActive ? 'text-blue-600' : 'text-gray-600'} hover:bg-gray-50 hover:text-blue-600`}
                onClick={toggleMenu}
              >
                CHILL MART
              </NavLink>
              <NavLink to="/about" 
                className={({isActive}) => `block py-2 px-4 ${isActive ? 'text-blue-600' : 'text-gray-600'} hover:bg-gray-50 hover:text-blue-600`}
                onClick={toggleMenu}
              >
                ABOUT
              </NavLink>
              <NavLink to="/contact" 
                className={({isActive}) => `block py-2 px-4 ${isActive ? 'text-blue-600' : 'text-gray-600'} hover:bg-gray-50 hover:text-blue-600`}
                onClick={toggleMenu}
              >
                CONTACT
              </NavLink>
              <NavLink to="/blog" 
                className={({isActive}) => `block py-2 px-4 ${isActive ? 'text-blue-600' : 'text-gray-600'} hover:bg-gray-50 hover:text-blue-600`}
                onClick={toggleMenu}
              >
                BLOG
              </NavLink>
            </nav>
            <div className="pt-6 mt-6 border-t border-gray-100">
              {token ? (
                <button 
                  onClick={() => { logout(); toggleMenu(); }} 
                  className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                >
                  Logout
                </button>
              ) : (
                <button 
                  onClick={() => { navigate('/login'); toggleMenu(); }} 
                  className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;