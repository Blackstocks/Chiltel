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
import { Modal } from "../components/Modal";
import ServiceCartView from "./ServiceCart";

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

  const [selectedService, setSelectedService] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [allWorks, setAllWorks] = useState([]);
  const [selectedWorks, setSelectedWorks] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const updateServiceRequest = async (serviceRequestId, updatedWorks) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/serviceRequests/${serviceRequestId}`,
        {
          addedWorks: updatedWorks, // Send the updated array of works
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add authorization token if required
          },
        }
      );

      if (response.data.success) {
        console.log("Service request updated successfully:", response.data);
        toast.success("Service request updated successfully");
      } else {
        console.error(
          "Failed to update service request:",
          response.data.message
        );
        toast.error("Failed to update service request");
      }
    } catch (error) {
      console.error("Error while updating service request:", error);
      toast.error("An error occurred while updating the service request");
    }
  };

  const handlePaymentModal = (service) => {
    console.log("service request: ", service);
    setSelectedService(service);
    setAllWorks(service.addedWorks);
    setSelectedWorks([]); // Clear previously selected works
    // setTotalPrice(0); // Start with base price
    setShowPaymentModal(true);
  };

  const handleWorkSelection = (work, isSelected) => {
    // Update selected works
    setSelectedWorks((prev) => {
      if (isSelected) {
        return [...prev, { ...work, approved: true }];
      } else {
        return prev.filter((item) => item.description !== work.description);
      }
    });

    // Update all works with approved status
    setAllWorks((prev) =>
      prev.map((item) =>
        item.description === work.description
          ? { ...item, approved: isSelected }
          : item
      )
    );

    // Update total price
    setTotalPrice((prev) =>
      isSelected ? prev + work.price : prev - work.price
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("chiltel-user-token");
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
    setShowPaymentModal(false);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log("init pay: ", response);
        response.serviceRequestId = serviceRequest._id;
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            response,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay',response,{headers:{token}})
          console.log("transaction data: ", data);
          if (data.success) {
            updateServiceRequest(selectedService._id, allWorks);
            console.log(selectedService._id, allWorks);
          }
        } catch (error) {
          console.log(error);
          toast.error(error);
        }
      },
      modal: {
        ondismiss: async () => {
          console.log("Payment window was closed by the user.");
          toast.error("Payment window closed. Cancelling the order...");

          // Cancel the order when the modal is closed
          try {
            await axios.post(
              `${backendUrl}/api/order/delete`,
              { orderId: newOrder._id },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Order canceled successfully");
          } catch (error) {
            console.error("Error while canceling order:", error);
            toast.error("Failed to cancel the order. Please contact support.");
          }
        },
      },
    };
    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", async (response) => {
      console.log("Payment failed or user closed dialog:", response);
      toast.error("Payment failed or was canceled by the user.");

      try {
        await axios.post(
          `${backendUrl}/api/order/delete`,
          { orderId: newOrder._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Order canceled successfully");
      } catch (error) {
        console.error("Error while canceling order:", error);
        toast.error("Failed to cancel the order. Please contact support.");
      }
    });

    rzp.open();
  };

  const handlePayment = async (serviceRequest, addedWorks, totalPrice) => {
    console.log("serive details: ", serviceRequest);
    toast.info("Initiating Payment");
    try {
      const services = [
        {
          service: serviceRequest._id,
          quantity: 1,
          price: serviceRequest.price,
        },
      ];

      console.log("order services: ", services);

      console.log("user: ", user);
      let orderData = {
        userId: user._id,
        orderType: "service",
        products: [],
        services: services,
        totalAmount: totalPrice,
        // totalAmount: serviceRequest.price,
        status: "ORDERED",
        paymentDetails: {
          method: "Razorpay",
          transactionId: "",
          paidAt: new Date(),
        },
        address: {
          street: serviceRequest.userLocation.address,
          city: "",
          state: "",
          zipCode: "",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("order data: ", orderData);
      const responseRazorpay = await axios.post(
        backendUrl + "/api/order/razorpay",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, {headers:{token}})
      console.log(responseRazorpay);
      if (responseRazorpay.data.success) {
        console.log("razorpay init success");
        console.log("razorpay response: ", responseRazorpay.data);
        initPay(
          responseRazorpay.data.order,
          responseRazorpay.data.newOrder,
          serviceRequest
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/serviceRequests/${selectedServiceId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {
            cancelReason,
          },
        }
      );

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
      {showPaymentModal && (
        <Modal onClose={() => setShowPaymentModal(false)}>
          <h2 className="text-lg font-bold mb-4">Add Additional Works</h2>
          <div className="space-y-3">
            {selectedService?.addedWorks?.map((work, index) => (
              <div key={index} className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleWorkSelection(work, e.target.checked)
                    }
                  />
                  <span>{work.description}</span>
                </label>
                <span className="text-gray-700 font-medium">
                  ₹ {work.price}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Total Price: <span className="font-bold">₹ {totalPrice}</span>
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() =>
                handlePayment(selectedService, selectedWorks, totalPrice)
              }
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Proceed to Payment
            </button>
          </div>
        </Modal>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-md">
            <h2 className="text-lg font-bold mb-4">Cancel Service</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for cancellation:
            </p>
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
      {view === "products" && (
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
                        updateQuantity(
                          user._id,
                          item.productId,
                          item.quantity - 1
                        );
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
                      updateQuantity(
                        user._id,
                        item.productId,
                        item.quantity + 1
                      );
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
                      const result = await removeFromCart(
                        user._id,
                        item.productId
                      );
                      if (result.success) {
                        setCartData(result.updatedCart.items);
                        setTotalAmount(result.updatedCart.totalAmount);
                      } else {
                        console.error(
                          "Failed to remove item from cart:",
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
                  onClick={() => navigate("/place-order")}
                  className="bg-black text-white text-sm my-8 px-8 py-3 rounded hover:bg-gray-800"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {view === "services" && (<ServiceCartView
        serviceCart={serviceCart}
        setShowCancelModal={setShowCancelModal}
        setSelectedServiceId={setSelectedServiceId}
        handlePaymentModal={handlePaymentModal}
      />)}
    </div>
  );
};

export default Cart;
