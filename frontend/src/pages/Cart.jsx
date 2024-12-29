import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import AuthContext from "../context/AuthContext";
import Loading from "../components/Loading";
import CartContext from "../context/CartContext";
import ServiceCartContext from "../context/ServiceCartContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";

const Cart = () => {
  const { backendUrl, navigate, token } = useContext(ShopContext);
  const { user, loading } = useContext(AuthContext);
  const { updateQuantity, removeFromCart } = useContext(CartContext);
  const { serviceCart, fetchServiceCart } = useContext(ServiceCartContext);

  const [totalAmount, setTotalAmount] = useState(0);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartData, setCartData] = useState([]);
  const [view, setView] = useState("products"); // Toggle between 'products' and 'services'

  const [expandedRow, setExpandedRow] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchCartDetails = async () => {
      try {
        const response = await axios.post(
          backendUrl + "/api/cart/get",
          { userId: user._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartData(response.data.cartData.items);
        setTotalAmount(response.data.cartData.totalAmount);
      } catch (err) {
        console.error("Error while fetching cart items: ", err);
      } finally {
        setCartLoading(false);
      }
    };

    if (!loading) {
      fetchCartDetails();
    }
  }, [loading]);

  const initPay = (order, newOrder, serviceRequest) => {
    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name:'Order Payment',
        description:'Order Payment',
        order_id: order.id,
        receipt: order.receipt,
        handler: async (response) => {
            console.log('init pay: ', response);
            response.serviceRequestId = serviceRequest._id;
            try {
                const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay',response,{headers: { Authorization: `Bearer ${token}` }})
                // const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay',response,{headers:{token}})
                console.log('transaction data: ', data);
                if (data.success) {
                    console.log('order info: ', data.orderInfo);
                    navigate('/orders')
                    setCartItems({})
                }
            } catch (error) {
                console.log(error)
                toast.error(error)
            }
        },
        modal: {
            ondismiss: async () => {
                console.log('Payment window was closed by the user.');
                toast.error('Payment window closed. Cancelling the order...');

                // Cancel the order when the modal is closed
                try {
                    await axios.post(
                        `${backendUrl}/api/order/delete`,
                        { orderId: newOrder._id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log('Order canceled successfully');
                } catch (error) {
                    console.error('Error while canceling order:', error);
                    toast.error('Failed to cancel the order. Please contact support.');
                }
            },
        },
    }
    const rzp = new window.Razorpay(options)

    rzp.on('payment.failed', async (response) => {
      console.log('Payment failed or user closed dialog:', response);
      toast.error('Payment failed or was canceled by the user.');

      try {
          await axios.post(
              `${backendUrl}/api/order/delete`,
              { orderId: newOrder._id },
              { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log('Order canceled successfully');
      } catch (error) {
          console.error('Error while canceling order:', error);
          toast.error('Failed to cancel the order. Please contact support.');
      }
    });

    rzp.open()
}

const handlePayment = async (serviceRequest) => {
    console.log('serive details: ', serviceRequest);
    try {

        const services = [
          {
            service: serviceRequest.service._id,
            quantity: 1,
            price: serviceRequest.price,
          }
        ]

        console.log('order services: ', services);
        
        console.log('user: ', user);
        let orderData = {
            userId: user._id,
            orderType: 'service',
            products: [],
            services: services,
            totalAmount: serviceRequest.price,
            status: "ORDERED",
            paymentDetails: {
                method: 'Razorpay',
                transactionId: "",
                paidAt: new Date()
            },
            address: {
                street: serviceRequest.userLocation.address,
                city: '',
                state: '',
                zipCode: '',
            },
            createdAt: new Date(),
            updatedAt: new Date()
        }

        console.log('order data: ', orderData);
        const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, {headers: { Authorization: `Bearer ${token}` }})
        // const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, {headers:{token}})
        console.log(responseRazorpay);
        if (responseRazorpay.data.success) {
            console.log('razorpay init success');
            console.log('razorpay response: ', responseRazorpay.data);
            initPay(responseRazorpay.data.order, responseRazorpay.data.newOrder, serviceRequest)
        }

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}

  // const handlePayment = (serviceId) => {
  //   console.log(`Paying for service ID: ${serviceId}`);
  //   // Implement payment logic here
  // };

  const handleCancel = async () => {
    try {
      const response = await axios.delete(`${backendUrl}/api/serviceRequests/${selectedServiceId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          cancelReason,
        },
      });
  
      if (response.data.success) {
        toast.info("Service cancelled successfully");
        fetchServiceCart();
        setShowCancelModal(false);
        setCancelReason("");
        setSelectedServiceId(null);
        // Optionally, refresh the services list here
      } else {
        alert("Failed to cancel service: " + response.data.message);
      }
    } catch (error) {
      console.error("Error cancelling service: ", error);
      alert("Something went wrong while cancelling the service.");
    }
  };
  

  const toggleRow = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  if (cartLoading) return <Loading />;

  return (
    <div className="border-t pt-14">
            {/* Cancel Modal */}
            {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-md">
            <h2 className="text-lg font-bold mb-4">Cancel Service</h2>
            <p className="text-sm text-gray-600 mb-4">Please provide a reason for cancellation:</p>
            <textarea
              className="w-full h-24 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter your reason"
            ></textarea>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setShowCancelModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                onClick={handleCancel}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-2xl mb-6">
        <Title text1="YOUR" text2="CART" />
      </div>

      {/* Toggle between Products and Services */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setView("products")}
          className={`px-6 py-2 rounded-l-lg border ${
            view === "products"
              ? "bg-black text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setView("services")}
          className={`px-6 py-2 rounded-r-lg border ${
            view === "services"
              ? "bg-black text-white"
              : "bg-gray-100 hover:bg-gray-200"
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
      {view === "services" && (
        <>
          {/* Services Table Headers */}
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] items-center border-b pb-2 text-gray-600 text-sm font-medium">
            <div>Service</div>
            <div>Description</div>
            <div>Price</div>
            <div>Duration</div>
            <div>Status</div>
            <div>Payment Status</div>
          </div>

          {/* Service Items */}
          <div>
            {serviceCart.map((service) => (
              service.status !== 'COMPLETED' && 
              <div
                key={service._id}
                className={`py-4 border-b text-gray-700 grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] items-center gap-4 ${
                  service.status === "REQUESTED"
                    ? "border-yellow-500 bg-yellow-50"
                    : ""
                }`}
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

                {/* Status */}
                <div>
                  <span
                    className={`px-2 py-1 text-sm font-medium rounded ${
                      service.status === "REQUESTED"
                        ? "bg-yellow-100 text-yellow-700"
                        : service.status === "CREATED"
                        ? "bg-gray-200 text-gray-700"
                        : service.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-700"
                        : service.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : service.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : ""
                    }`}
                  >
                    {service.status}
                  </span>
                </div>

                {/* Payment Status */}
                <div>
                  {service.status === "REQUESTED" ? (
                    <button
                      onClick={() => handlePayment(service)}
                      className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span
                      className={`px-2 py-1 text-sm font-medium rounded ${
                        service.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : service.paymentStatus === "REFUNDED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {service.paymentStatus}
                    </span>
                  )}
                </div>

                {/* More Options */}
                <div className="relative">
                  <button
                    onClick={() => toggleRow(service._id)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border rounded-md hover:bg-gray-200 focus:outline-none"
                  >
                    {expandedRow === service._id ? "Less Info" : "More Info"}{" "}
                    {expandedRow === service._id ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {expandedRow === service._id && (
                    <div className="absolute mt-2 z-10 w-full p-4 text-sm bg-white border rounded-lg shadow-md">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Scheduled Date and Time */}
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-700">Scheduled Date</span>
                          <p className="text-gray-600">{new Date(service.scheduledFor).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-700">Scheduled Time</span>
                          <p className="text-gray-600">{new Date(service.scheduledFor).toLocaleTimeString()}</p>
                        </div>

                        {/* Status */}
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-700">Status</span>
                          <span
                            className={`px-2 py-1 mt-1 text-sm font-medium text-center rounded-md ${
                              service.status === "CREATED"
                                ? "bg-gray-200 text-gray-700"
                                : service.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-700"
                                : service.status === "COMPLETED"
                                ? "bg-green-100 text-green-700"
                                : service.status === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {service.status}
                          </span>
                        </div>

                        {/* Payment Status */}
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-700">Payment Status</span>
                          <span
                            className={`px-2 py-1 mt-1 text-sm font-medium text-center rounded-md ${
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
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex flex-col gap-2">
                          {service.status === "CREATED" && (
                            <button
                              onClick={() => {
                                setSelectedServiceId(service._id);
                                setShowCancelModal(true);
                              }}
                              className="w-full px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                            >
                              Cancel Service
                            </button>
                          )}
                        {service.status === "REQUESTED" && (
                          <button
                            onClick={() => handlePayment(service._id)}
                            className="w-full px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  )}
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
// import ServiceCartContext from '../context/ServiceCartContext';

// const Cart = () => {
//   const { backendUrl, navigate } = useContext(ShopContext);
//   const { user, loading } = useContext(AuthContext);
//   const { updateQuantity, removeFromCart } = useContext(CartContext);
//   const { serviceCart } = useContext(ServiceCartContext);

//   const [totalAmount, setTotalAmount] = useState(0);
//   const [cartLoading, setCartLoading] = useState(true);
//   const [cartData, setCartData] = useState([]);
//   const [view, setView] = useState('products'); // Toggle between 'products' and 'services'

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

//       {/* Toggle between Products and Services */}
//       <div className="flex justify-center mb-6">
//         <button
//           onClick={() => setView('products')}
//           className={`px-6 py-2 rounded-l-lg border ${
//             view === 'products'
//               ? 'bg-black text-white'
//               : 'bg-gray-100 hover:bg-gray-200'
//           }`}
//         >
//           Products
//         </button>
//         <button
//           onClick={() => setView('services')}
//           className={`px-6 py-2 rounded-r-lg border ${
//             view === 'services'
//               ? 'bg-black text-white'
//               : 'bg-gray-100 hover:bg-gray-200'
//           }`}
//         >
//           Services
//         </button>
//       </div>

      // {/* Products Section */}
      // {view === 'products' && (
      //   <>
      //     {/* Cart Table Headers */}
      //     <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] sm:grid-cols-[3fr_1fr_1fr_1fr_0.5fr] items-center border-b pb-2 text-gray-600 text-sm font-medium">
      //       <div>Product</div>
      //       <div>Image</div>
      //       <div>Quantity</div>
      //       <div>Price</div>
      //       <div>Actions</div>
      //     </div>

      //     {/* Cart Items */}
      //     <div>
      //       {cartData.map((item) => (
      //         <div
      //           key={item._id}
      //           className="py-4 border-b text-gray-700 grid grid-cols-[2fr_1fr_1fr_1fr_0.5fr] sm:grid-cols-[3fr_1fr_1fr_1fr_0.5fr] items-center gap-4"
      //         >
      //           {/* Product Name */}
      //           <div>
      //             <p className="text-xs sm:text-lg font-medium">{item.name}</p>
      //           </div>

      //           {/* Product Image */}
      //           <div>
      //             <img
      //               className="w-16 sm:w-20"
      //               src={item.image}
      //               alt={item.name}
      //             />
      //           </div>

      //           {/* Quantity Control */}
      //           <div className="flex items-center gap-2">
      //             <button
      //               className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
      //               onClick={() => {
      //                 if (item.quantity > 1) {
      //                   updateQuantity(user._id, item.productId, item.quantity - 1);
      //                   setCartData((prev) =>
      //                     prev.map((data) =>
      //                       data._id === item._id
      //                         ? { ...data, quantity: data.quantity - 1 }
      //                         : data
      //                     )
      //                   );
      //                 }
      //               }}
      //             >
      //               -
      //             </button>
      //             <span className="w-8 text-center border px-2 py-1 rounded bg-gray-50">
      //               {item.quantity}
      //             </span>
      //             <button
      //               className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
      //               onClick={() => {
      //                 updateQuantity(user._id, item.productId, item.quantity + 1);
      //                 setCartData((prev) =>
      //                   prev.map((data) =>
      //                     data._id === item._id
      //                       ? { ...data, quantity: data.quantity + 1 }
      //                       : data
      //                   )
      //                 );
      //               }}
      //             >
      //               +
      //             </button>
      //           </div>

      //           {/* Price */}
      //           <div>
      //             <p>Rs {`${item.price}`}</p>
      //           </div>

      //           {/* Remove Action */}
      //           <div>
      //             <img
      //               onClick={async () => {
      //                 const result = await removeFromCart(user._id, item.productId);
      //                 if (result.success) {
      //                   setCartData(result.updatedCart.items);
      //                   setTotalAmount(result.updatedCart.totalAmount);
      //                 } else {
      //                   console.error(
      //                     'Failed to remove item from cart:',
      //                     result.error
      //                   );
      //                 }
      //               }}
      //               className="w-5 cursor-pointer hover:text-red-500 hover:opacity-80"
      //               src={assets.bin_icon}
      //               alt="Remove"
      //             />
      //           </div>
      //         </div>
      //       ))}
      //     </div>

      //     {/* Cart Summary */}
      //     <div className="flex justify-end my-10">
      //       <div className="w-full sm:w-[450px]">
      //         <CartTotal />
      //         <div className="w-full text-end">
      //           <button
      //             onClick={() => navigate('/place-order')}
      //             className="bg-black text-white text-sm my-8 px-8 py-3 rounded hover:bg-gray-800"
      //           >
      //             PROCEED TO CHECKOUT
      //           </button>
      //         </div>
      //       </div>
      //     </div>
      //   </>
      // )}

//       {/* Services Section */}
// {view === 'services' && (
//   <>
//     {/* Services Table Headers */}
//     <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] items-center border-b pb-2 text-gray-600 text-sm font-medium">
//       <div>Service</div>
//       <div>Description</div>
//       <div>Price</div>
//       <div>Duration</div>
//       <div>Status</div>
//       <div>Payment Status</div>
//       <div>Scheduled For</div>
//     </div>

//     {/* Service Items */}
//     <div>
//       {serviceCart.map((service) => (
//         <div
//           key={service._id}
//           className="py-4 border-b text-gray-700 grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] items-center gap-4"
//         >
//           {/* Service Name */}
//           <div>
//             <p className="text-xs sm:text-lg font-medium">
//               {service.service.name}
//             </p>
//           </div>

//           {/* Description */}
//           <div>
//             <p className="text-sm">{service.service.description}</p>
//           </div>

//           {/* Price */}
//           <div>
//             <p>Rs {service.price}</p>
//           </div>

//           {/* Duration */}
//           <div>
//             <p>{service.service.estimatedDuration}</p>
//           </div>

//           {/* Status with Color Coding */}
//           <div>
//             <span
//               className={`px-2 py-1 text-sm font-medium rounded ${
//                 service.status === "CREATED"
//                   ? "bg-gray-200 text-gray-700"
//                   : service.status === "IN_PROGRESS"
//                   ? "bg-blue-100 text-blue-700"
//                   : service.status === "COMPLETED"
//                   ? "bg-green-100 text-green-700"
//                   : service.status === "CANCELLED"
//                   ? "bg-red-100 text-red-700"
//                   : "bg-yellow-100 text-yellow-700" // Default for other statuses
//               }`}
//             >
//               {service.status}
//             </span>
//           </div>

//           {/* Payment Status with Color Coding */}
//           <div>
//             <span
//               className={`px-2 py-1 text-sm font-medium rounded ${
//                 service.paymentStatus === "PENDING"
//                   ? "bg-yellow-100 text-yellow-700"
//                   : service.paymentStatus === "PAID"
//                   ? "bg-green-100 text-green-700"
//                   : service.paymentStatus === "REFUNDED"
//                   ? "bg-red-100 text-red-700"
//                   : "bg-gray-200 text-gray-700"
//               }`}
//             >
//               {service.paymentStatus}
//             </span>
//           </div>

//           {/* Scheduled For */}
          // <div>
          //   <p>{new Date(service.scheduledFor).toLocaleDateString()}</p>
          //   <p className="text-sm text-gray-500">
          //     {new Date(service.scheduledFor).toLocaleTimeString()}
          //   </p>
          // </div>
//         </div>
//       ))}
//     </div>
//   </>
// )}

//     </div>
//   );
// };

// export default Cart;