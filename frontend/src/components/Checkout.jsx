import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  CreditCard,
  Wallet,
  Truck,
  Clock,
  Phone,
} from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productData = location.state?.product;
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
    upiId: "",
    emiTenure: "3",
  });

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "shipping") {
      setShippingDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setPaymentDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Processing order:", { shippingDetails, paymentDetails });
    setShowSuccess(true);
  };

  // Payment method options
  const paymentMethods = [
    { id: "credit-card", name: "Credit Card", icon: CreditCard },
    { id: "debit-card", name: "Debit Card", icon: CreditCard },
    { id: "upi", name: "UPI Payment", icon: Phone },
    { id: "emi", name: "EMI", icon: Clock },
    { id: "cod", name: "Cash on Delivery", icon: Truck },
  ];

  return (
    <>
      {/* Embedded CSS */}
      <style>
        {`
          @keyframes ping {
            0% { transform: scale(0); opacity: 1; }
            75%, 100% { transform: scale(1.2); opacity: 0; }
          }

          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .ping-animation { animation: ping 1s ease-in-out; }
          .fade-in-animation { animation: fadeIn 0.5s ease-in-out; }
          .bounce-animation { animation: bounce 0.5s ease-in-out; }
          .success-icon { animation: fadeIn 0.5s ease-in-out, bounce 0.5s ease-in-out; }

          .bg-grid-slate-100 {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23F1F5F9' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          }
        `}
      </style>

      {/* Main Container */}
      <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

        <div className="px-4 mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Secure Checkout
            </h1>
            <p className="text-gray-600">Complete your purchase securely</p>
          </div>

          {/* Order Summary Card - Visible on Mobile */}
          <div className="p-4 mb-6 bg-white rounded-lg shadow-lg lg:hidden">
            <div className="flex items-center space-x-4">
              <img
                src={productData?.image || "https://via.placeholder.com/100"}
                alt="Product"
                className="object-cover w-20 h-20 rounded-md"
              />
              <div>
                <h3 className="font-medium">
                  {productData?.name || "Product Name"}
                </h3>
                <p className="font-semibold text-blue-600">
                  ₹{productData?.price || "0.00"}
                </p>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-8 lg:grid-cols-2"
          >
            {/* Left Column - Shipping Details */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="flex items-center mb-6 space-x-2">
                <Truck className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold">Shipping Details</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingDetails.fullName}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingDetails.email}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingDetails.phone}
                    onChange={(e) => handleInputChange(e, "shipping")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={shippingDetails.address}
                    onChange={(e) => handleInputChange(e, "shipping")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      State
                    </label>
                    <select
                      name="state"
                      value={shippingDetails.state}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingDetails.city}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingDetails.pincode}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment Details */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="mb-6 text-xl font-semibold">Payment Method</h2>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center justify-center gap-3 py-4 px-4 border-2 rounded-lg transition-all duration-200 ${
                      paymentMethod === method.id
                        ? "border-blue-500 bg-blue-50 text-blue-500 transform scale-105"
                        : "border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50"
                    } font-medium relative overflow-hidden`}
                  >
                    <method.icon className="w-5 h-5" />
                    {method.name}
                    {paymentMethod === method.id && (
                      <span className="absolute inset-0 bg-blue-500 opacity-10"></span>
                    )}
                  </button>
                ))}
              </div>

              {/* Payment Forms */}
              {(paymentMethod === "credit-card" ||
                paymentMethod === "debit-card") && (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Name on card
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentDetails.cardName}
                      onChange={(e) => handleInputChange(e, "payment")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={
                        paymentMethod === "credit-card" ||
                        paymentMethod === "debit-card"
                      }
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => {
                        const formattedValue = formatCardNumber(e.target.value);
                        setPaymentDetails((prev) => ({
                          ...prev,
                          cardNumber: formattedValue,
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="4444 4444 4444 4444"
                      maxLength="19"
                      required={
                        paymentMethod === "credit-card" ||
                        paymentMethod === "debit-card"
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentDetails.expiryDate}
                        onChange={(e) => handleInputChange(e, "payment")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="MM/YY"
                        maxLength="5"
                        required={
                          paymentMethod === "credit-card" ||
                          paymentMethod === "debit-card"
                        }
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        CVV
                      </label>
                      <input
                        type="password"
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={(e) => handleInputChange(e, "payment")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="•••"
                        maxLength="4"
                        required={
                          paymentMethod === "credit-card" ||
                          paymentMethod === "debit-card"
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={paymentDetails.upiId}
                      onChange={(e) => handleInputChange(e, "payment")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="username@upi"
                      required={paymentMethod === "upi"}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "emi" && (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Select EMI Tenure
                    </label>
                    <select
                      name="emiTenure"
                      value={paymentDetails.emiTenure}
                      onChange={(e) => handleInputChange(e, "payment")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={paymentMethod === "emi"}
                    >
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="9">9 Months</option>
                      <option value="12">12 Months</option>
                    </select>
                  </div>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-gray-600">
                    Pay with cash when your order is delivered. Additional
                    charges may apply.
                  </p>
                </div>
              )}

              {/* Order Summary */}
              <div className="pt-6 mt-8 border-t">
                <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{productData?.price || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₹49.00</span>
                  </div>
                  <div className="flex justify-between pt-2 text-lg font-semibold border-t">
                    <span>Total</span>
                    <span>
                      ₹{(parseInt(productData?.price || 0) + 49).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-3 mt-6 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Place Order
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl fade-in-animation">
            {/* Top Pattern */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-blue-500 to-purple-500 opacity-10"></div>

            <div className="relative p-6">
              <div className="flex flex-col items-center">
                {/* Success Animation */}
                <div className="relative flex items-center justify-center w-24 h-24 mb-4">
                  <div className="absolute w-full h-full border-4 border-green-500 rounded-full ping-animation"></div>
                  <CheckCircle className="w-16 h-16 text-green-500 success-icon" />
                </div>

                <h2 className="mb-2 text-2xl font-bold text-center text-gray-800 fade-in-animation">
                  Order Placed Successfully!
                </h2>
                <p className="mb-6 text-center text-gray-600 fade-in-animation">
                  Thank you for your purchase. Your order has been confirmed.
                  We'll send you a confirmation email shortly.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 fade-in-animation"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => navigate("/orders")}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 fade-in-animation"
                  >
                    View Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentGateway;
