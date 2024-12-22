import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import AuthContext from '../context/AuthContext';
import Loading from '../components/Loading';
import CartContext from '../context/CartContext';
import ServiceCartContext from '../context/ServiceCartContext';

const Cart = () => {
  const { backendUrl, navigate } = useContext(ShopContext);
  const { user, loading } = useContext(AuthContext);
  const { updateQuantity, removeFromCart } = useContext(CartContext);
  const { serviceCart } = useContext(ServiceCartContext);

  const [totalAmount, setTotalAmount] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [view, setView] = useState('products'); // Toggle between 'products' and 'services'

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchCartDetails = async () => {
      try {
        const response = await axios.post(
          backendUrl + '/api/cart/get',
          { userId: user._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartData(response.data.cartData.items);
        setTotalAmount(response.data.cartData.totalAmount);
      } catch (err) {
        console.error('Error while fetching cart items: ', err);
      } finally {
        setCartLoading(false);
      }
    };

    if (!loading) {
      fetchCartDetails();
    }
  }, [loading]);

  if (cartLoading) return <Loading />;

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-6">
        <Title text1="YOUR" text2="CART" />
      </div>

      {/* Toggle between Products and Services */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setView('products')}
          className={`px-6 py-2 rounded-l-lg border ${
            view === 'products'
              ? 'bg-black text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setView('services')}
          className={`px-6 py-2 rounded-r-lg border ${
            view === 'services'
              ? 'bg-black text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Services
        </button>
      </div>

      {/* Products Section */}
      {view === 'products' && (
        <>
          {/* Cart Table Headers */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] sm:grid-cols-[3fr_1fr_1fr_1fr_0.5fr] items-center border-b pb-2 text-gray-600 text-sm font-medium">
            <div>Product</div>
            <div>Image</div>
            <div>Quantity</div>
            <div>Price</div>
            <div>Actions</div>
          </div>

          {/* Cart Items */}
          <div>
            {cartData.map((item) => (
              <div
                key={item._id}
                className="py-4 border-b text-gray-700 grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] sm:grid-cols-[3fr_1fr_1fr_1fr_0.5fr] items-center gap-4"
              >
                {/* Product Name */}
                <div>
                  <p className="text-xs sm:text-lg font-medium">{item.name}</p>
                </div>

                {/* Product Image */}
                <div>
                  <img
                    className="w-16 sm:w-20"
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                {/* Quantity Control */}
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(user._id, item.productId, item.quantity - 1);
                        setCartData((prev) =>
                          prev.map((data) =>
                            data._id === item._id
                              ? { ...data, quantity: data.quantity - 1 }
                              : data
                          )
                        );
                      }
                    }}
                  >
                    -
                  </button>
                  <span className="w-8 text-center border px-2 py-1 rounded bg-gray-50">
                    {item.quantity}
                  </span>
                  <button
                    className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => {
                      updateQuantity(user._id, item.productId, item.quantity + 1);
                      setCartData((prev) =>
                        prev.map((data) =>
                          data._id === item._id
                            ? { ...data, quantity: data.quantity + 1 }
                            : data
                        )
                      );
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div>
                  <p>Rs {`${item.price}`}</p>
                </div>

                {/* Remove Action */}
                <div>
                  <img
                    onClick={async () => {
                      const result = await removeFromCart(user._id, item.productId);
                      if (result.success) {
                        setCartData(result.updatedCart.items);
                        setTotalAmount(result.updatedCart.totalAmount);
                      } else {
                        console.error(
                          'Failed to remove item from cart:',
                          result.error
                        );
                      }
                    }}
                    className="w-5 cursor-pointer hover:text-red-500 hover:opacity-80"
                    src={assets.bin_icon}
                    alt="Remove"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="flex justify-end my-10">
            <div className="w-full sm:w-[450px]">
              <CartTotal />
              <div className="w-full text-end">
                <button
                  onClick={() => navigate('/place-order')}
                  className="bg-black text-white text-sm my-8 px-8 py-3 rounded hover:bg-gray-800"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Services Section */}
{view === 'services' && (
  <>
    {/* Services Table Headers */}
    <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] items-center border-b pb-2 text-gray-600 text-sm font-medium">
      <div>Service</div>
      <div>Description</div>
      <div>Price</div>
      <div>Duration</div>
      <div>Status</div>
      <div>Payment Status</div>
      <div>Scheduled For</div>
    </div>

    {/* Service Items */}
    <div>
      {serviceCart.map((service) => (
        <div
          key={service._id}
          className="py-4 border-b text-gray-700 grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] items-center gap-4"
        >
          {/* Service Name */}
          <div>
            <p className="text-xs sm:text-lg font-medium">
              {service.service.name}
            </p>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm">{service.service.description}</p>
          </div>

          {/* Price */}
          <div>
            <p>Rs {service.price}</p>
          </div>

          {/* Duration */}
          <div>
            <p>{service.service.estimatedDuration}</p>
          </div>

          {/* Status with Color Coding */}
          <div>
            <span
              className={`px-2 py-1 text-sm font-medium rounded ${
                service.status === "CREATED"
                  ? "bg-gray-200 text-gray-700"
                  : service.status === "IN_PROGRESS"
                  ? "bg-blue-100 text-blue-700"
                  : service.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : service.status === "CANCELLED"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700" // Default for other statuses
              }`}
            >
              {service.status}
            </span>
          </div>

          {/* Payment Status with Color Coding */}
          <div>
            <span
              className={`px-2 py-1 text-sm font-medium rounded ${
                service.paymentStatus === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : service.paymentStatus === "PAID"
                  ? "bg-green-100 text-green-700"
                  : service.paymentStatus === "REFUNDED"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {service.paymentStatus}
            </span>
          </div>

          {/* Scheduled For */}
          <div>
            <p>{new Date(service.scheduledFor).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">
              {new Date(service.scheduledFor).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  </>
)}

    </div>
  );
};

export default Cart;


// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { ShopContext } from '../context/ShopContext';
// import Title from '../components/Title';
// import { assets } from '../assets/assets';
// import CartTotal from '../components/CartTotal';
// import AuthContext from '../context/AuthContext';
// import Loading from '../components/Loading';
// import CartContext from '../context/CartContext';

// const Cart = () => {
//   const { backendUrl, navigate } = useContext(ShopContext);
//   const { user, loading } = useContext(AuthContext);
//   const { updateQuantity, removeFromCart } = useContext(CartContext);

//   const [totalAmount, setTotalAmount] = useState(0);
//   const [cartLoading, setCartLoading] = useState(true);
//   const [cartData, setCartData] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const fetchCartDetails = async () => {
//       try {
//         const response = await axios.post(
//           backendUrl + '/api/cart/get',
//           { userId: user._id },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setCartData(response.data.cartData.items);
//         setTotalAmount(response.data.cartData.totalAmount);
//       } catch (err) {
//         console.error('Error while fetching cart items: ', err);
//       } finally {
//         setCartLoading(false);
//       }
//     };

//     if (!loading) {
//       fetchCartDetails();
//     }
//   }, [loading]);

//   if (cartLoading) return <Loading />;

//   return (
//     <div className="border-t pt-14">
//       <div className="text-2xl mb-6">
//         <Title text1="YOUR" text2="CART" />
//       </div>

//       {/* Cart Table Headers */}
//       <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] sm:grid-cols-[3fr_1fr_1fr_1fr_0.5fr] items-center border-b pb-2 text-gray-600 text-sm font-medium">
//         <div>Product</div>
//         <div>Image</div>
//         <div>Quantity</div>
//         <div>Price</div>
//         <div>Actions</div>
//       </div>

//       {/* Cart Items */}
//       <div>
//         {cartData.map((item) => (
//           <div
//             key={item._id}
//             className="py-4 border-b text-gray-700 grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] sm:grid-cols-[3fr_1fr_1fr_1fr_0.5fr] items-center gap-4"
//           >
//             {/* Product Name */}
//             <div>
//               <p className="text-xs sm:text-lg font-medium">{item.name}</p>
//             </div>

//             {/* Product Image */}
//             <div>
//               <img className="w-16 sm:w-20" src={item.image} alt={item.name} />
//             </div>

//             {/* Quantity Control */}
//             <div className="flex items-center gap-2">
//               <button
//                 className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
//                 onClick={() => {
//                   if (item.quantity > 1) {
//                     updateQuantity(user._id, item.productId, item.quantity - 1);
//                     setCartData((prev) =>
//                       prev.map((data) =>
//                         data._id === item._id
//                           ? { ...data, quantity: data.quantity - 1 }
//                           : data
//                       )
//                     );
//                   }
//                 }}
//               >
//                 -
//               </button>
//               <span className="w-8 text-center border px-2 py-1 rounded bg-gray-50">
//                 {item.quantity}
//               </span>
//               <button
//                 className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
//                 onClick={() => {
//                   updateQuantity(user._id, item.productId, item.quantity + 1);
//                   setCartData((prev) =>
//                     prev.map((data) =>
//                       data._id === item._id
//                         ? { ...data, quantity: data.quantity + 1 }
//                         : data
//                     )
//                   );
//                 }}
//               >
//                 +
//               </button>
//             </div>

//             {/* Price */}
//             <div>
//               <p>Rs {`${item.price}`}</p>
//             </div>

//             {/* Remove Action */}
//             <div>
//               <img
//                 onClick={async () => {
//                   const result = await removeFromCart(user._id, item.productId);
//                   if (result.success) {
//                     setCartData(result.updatedCart.items);
//                     setTotalAmount(result.updatedCart.totalAmount);
//                   } else {
//                     console.error('Failed to remove item from cart:', result.error);
//                   }
//                 }}
//                 className="w-5 cursor-pointer hover:text-red-500 hover:opacity-80"
//                 src={assets.bin_icon}
//                 alt="Remove"
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Cart Summary */}
//       <div className="flex justify-end my-10">
//         <div className="w-full sm:w-[450px]">
//           <CartTotal />
//           <div className="w-full text-end">
//             <button
//               onClick={() => navigate('/place-order')}
//               className="bg-black text-white text-sm my-8 px-8 py-3 rounded hover:bg-gray-800"
//             >
//               PROCEED TO CHECKOUT
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;
