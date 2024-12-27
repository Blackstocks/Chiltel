import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [userId, setUserId] = useState("");
  // const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setUserId(user?._id);
  }, [loading]);

  // useEffect(()=>{
  //     const getCount = async ()=> {
  //         try{
  //             const data = await getCartCount(userId);
  //             setCartCount(data);
  //         }catch(err){
  //             console.error(err);
  //         }
  //     }
  //     if(!loading){
  //         getCount();
  //     }
  // }, [user, loading])

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem('chiltel-user-token');
  //   setToken("");
  //   setCartItems({});
  //   navigate("/login");
  // };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src="/assets/logoc.png" className="w-30" alt="" />
      </Link>

      <ul className="hidden gap-5 text-sm text-gray-700 sm:flex">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/blog" className="flex flex-col items-center gap-1">
          <p>BLOG</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <div className="relative z-50 group">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            className="w-5 cursor-pointer"
            src={assets.profile_icon}
            alt=""
          />
          {/* Dropdown Menu */}
          {token && (
            <div className="absolute right-0 hidden pt-4 group-hover:block dropdown-menu">
              <div className="flex flex-col gap-2 px-5 py-3 text-gray-500 rounded w-36 bg-slate-100">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {cartCount}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* Sidebar menu for small screens */}
      <div
        className={`fixed top-0 right-0 bottom-0 bg-white transition-all z-50 ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="z-10 flex flex-col h-full text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="Back"
            />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border-t border-gray-200"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border-t border-gray-200"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border-t border-gray-200"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border-t border-gray-200"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
