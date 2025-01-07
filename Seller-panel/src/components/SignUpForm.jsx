import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const SignupForm = () => {
	const [step, setStep] = useState(1);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
	  email: '',
	  password: '',
	  shopName: '',         // Changed from firmName to shopName
	  proprietorName: '',
	  aadharNumber: '',
	  phoneNumber: '',      // Changed from contactNumber to phoneNumber
	  registeredAddress: {
		street: '',
		city: '',
		state: '',
		pincode: ''
	  },
	  warehouseAddress: {
		street: '',
		city: '',
		state: '',
		pincode: ''
	  },
	  agreementAccepted: false  // Changed from termsAccepted to agreementAccepted
	});
  
	const handleSubmit = async (stepData) => {
	  const newFormData = { ...formData, ...stepData };
	  setFormData(newFormData);
  
	  if (step < 4) {
		setStep(step + 1);
		return;
	  }
  
	  try {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/seller/register`, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
			email: newFormData.email,
			password: newFormData.password,
			shopName: newFormData.shopName,
			proprietorName: newFormData.proprietorName,
			aadharNumber: newFormData.aadharNumber,
			phoneNumber: newFormData.phoneNumber,
			registeredAddress: newFormData.registeredAddress,
			warehouseAddress: newFormData.warehouseAddress,
			agreementAccepted: newFormData.agreementAccepted
		  }),
		});
  
		const data = await response.json();
  
		if (response.ok) {
		  // Show success message
		  toast.success(data.message);
		  // Redirect to login page after successful registration
		  navigate('/auth');
		} else {
		  // Show error message
		  toast.error(data.message);
		}
	  } catch (error) {
		console.error('Registration failed:', error);
		toast.error('Registration failed. Please try again.');
	  }
	};

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AuthenticationStep onSubmit={handleSubmit} />;
      case 2:
        return (
          <StoreInfoStep onSubmit={handleSubmit} onBack={handlePrevious} />
        );
      case 3:
        return (
          <RegisteredAddressStep
            onSubmit={handleSubmit}
            onBack={handlePrevious}
          />
        );
      case 4:
        return (
          <WarehouseAddressStep
            onSubmit={handleSubmit}
            onBack={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return <div className="max-w-md mx-auto mt-0">{renderStep()}</div>;
};

const AuthenticationStep = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h2 className="text-lg font-medium">Authentication Details</h2>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email Address</label>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          type="email"
          placeholder="seller@example.com"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <div className="relative">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            type="password"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => {
              const input = document.querySelector('input[type="password"]');
              input.type = input.type === "password" ? "text" : "password";
            }}
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2"
      >
        Next
      </button>
    </form>
  );
};

const StoreInfoStep = ({ onSubmit, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h2 className="text-lg font-medium">Store Information</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Firm/Shop Name</label>
          <input
            {...register('shopName', { required: 'Shop name is required' })}
            placeholder="Enter shop name"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
          />
          {errors.shopName && <span className="text-red-500 text-sm">{errors.shopName.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Proprietor Name</label>
          <input
            {...register('proprietorName', { required: 'Proprietor name is required' })}
            placeholder="Enter proprietor name"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
          />
          {errors.proprietorName && <span className="text-red-500 text-sm">{errors.proprietorName.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Aadhar Card Number</label>
          <input
            {...register('aadharNumber', { 
              required: 'Aadhar number is required',
              pattern: {
                value: /^\d{12}$/,
                message: 'Invalid Aadhar number'
              }
            })}
            placeholder="Enter Aadhar number"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
          />
          {errors.aadharNumber && <span className="text-red-500 text-sm">{errors.aadharNumber.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            {...register('phoneNumber', { 
              required: 'Contact number is required',
              pattern: {
                value: /^\d{10}$/,
                message: 'Invalid contact number'
              }
            })}
            placeholder="Enter phone number"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
          />
          {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber.message}</span>}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-black bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2"
        >
          Next
        </button>
      </div>
    </form>
  );
};

const RegisteredAddressStep = ({ onSubmit, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <h2 className="text-lg font-medium">Registered Address</h2>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Street Address</label>
        <input
          {...register("registeredAddress.street", {
            required: "Street address is required",
          })}
          placeholder="Enter street address"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
        />
        {errors.registeredAddress?.street && (
          <span className="text-red-500 text-sm">
            {errors.registeredAddress.street.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            {...register("registeredAddress.city", {
              required: "City is required",
            })}
            placeholder="Enter city"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
          />
          {errors.registeredAddress?.city && (
            <span className="text-red-500 text-sm">
              {errors.registeredAddress.city.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            {...register("registeredAddress.state", {
              required: "State is required",
            })}
            placeholder="Enter state"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
          />
          {errors.registeredAddress?.state && (
            <span className="text-red-500 text-sm">
              {errors.registeredAddress.state.message}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Pincode</label>
        <input
          {...register("registeredAddress.pincode", {
            required: "Pincode is required",
            pattern: {
              value: /^\d{6}$/,
              message: "Invalid pincode",
            },
          })}
          placeholder="Enter pincode"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
        />
        {errors.registeredAddress?.pincode && (
          <span className="text-red-500 text-sm">
            {errors.registeredAddress.pincode.message}
          </span>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-black bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2"
        >
          Next
        </button>
      </div>
    </form>
  );
};

const WarehouseAddressStep = ({ onSubmit, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h2 className="text-lg font-medium">Warehouse Address</h2>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Street Address</label>
        <input
          {...register("warehouseAddress.street", {
            required: "Street address is required",
          })}
          placeholder="Enter street address"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
        />
        {errors.warehouseAddress?.street && (
          <span className="text-red-500 text-sm">
            {errors.warehouseAddress.street.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            {...register("warehouseAddress.city", {
              required: "City is required",
            })}
            placeholder="Enter city"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
          />
          {errors.warehouseAddress?.city && (
            <span className="text-red-500 text-sm">
              {errors.warehouseAddress.city.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            {...register("warehouseAddress.state", {
              required: "State is required",
            })}
            placeholder="Enter state"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
          />
          {errors.warehouseAddress?.state && (
            <span className="text-red-500 text-sm">
              {errors.warehouseAddress.state.message}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Pincode</label>
        <input
          {...register("warehouseAddress.pincode", {
            required: "Pincode is required",
            pattern: {
              value: /^\d{6}$/,
              message: "Invalid pincode",
            },
          })}
          placeholder="Enter pincode"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-1"
        />
        {errors.warehouseAddress?.pincode && (
          <span className="text-red-500 text-sm">
            {errors.warehouseAddress.pincode.message}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          {...register('agreementAccepted', { required: 'You must accept the terms' })}
          className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
        />
        <label className="text-sm text-gray-600">
          I agree to the Terms of Service and Privacy Policy
        </label>
      </div>
      {errors.agreementAccepted && 
        <span className="text-red-500 text-sm block">{errors.agreementAccepted.message}</span>}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-black bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2"
        >
          Submit Registration
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
