import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/orders'); // Redirect to orders page
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timeout on component unmount
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-white-50 via-white to-white-100">
      <div className="relative bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full text-center">
        {/* Success Animation */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-12 h-12"
              viewBox="0 0 52 52"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
                stroke="#22C55E"
                strokeWidth="4"
              />
              <path
                className="checkmark__check"
                fill="none"
                stroke="#22C55E"
                strokeWidth="4"
                d="M14 27l7 7 16-16"
              />
            </svg>
          </div>
        </div>

        {/* Confirmation Text */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {/* Redirecting Information */}
        <p className="text-sm text-gray-500">
          Redirecting to your orders page in a few seconds...
        </p>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-[-1] flex justify-center items-center">
          <div className="absolute bg-gradient-to-br from-blue-500 to-blue-200 opacity-10 w-96 h-96 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
