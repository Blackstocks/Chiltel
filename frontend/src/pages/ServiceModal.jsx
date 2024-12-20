import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Plus, Minus } from 'lucide-react';

const ServiceModal = ({ isOpen, onClose, category }) => {
  if (!isOpen) return null;

  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  // Main categories and their subcategories for AC
  const acServiceCategories = {
    "Installation": [
      { 
        name: "Window AC Installation",
        price: 700,
        duration: "2-3 hours",
        description: "Professional installation including brackets and basic materials" 
      },
      { 
        name: "Split AC Installation",
        price: 1800,
        duration: "3-4 hours",
        description: "Complete split AC installation with copper piping up to 3ft" 
      }
    ],
    "Service": [
      { 
        name: "Dry Service",
        price: 499,
        duration: "40 minutes",
        description: "Basic cleaning and maintenance" 
      },
      { 
        name: "Deep Clean Service",
        price: 799,
        duration: "90 minutes",
        description: "Thorough cleaning with foam wash" 
      },
      { 
        name: "Wet Service",
        price: 599,
        duration: "1-2 hours",
        description: "Complete Wet Service with leak test" 
      }
    ],
    "Repair": [
      { 
        name: "Attending Charges",
        price: 499,
        duration: "30-60 minutes",
        description: "Diagnosis and minor repairs" 
      },
      { 
        name: "Gas Refilling",
        price: 1500,
        duration: "1-2 hours",
        description: "Gas Refilling and testing" 
      }
    ]
  };

  // Regular service details for other categories
  const serviceDetails = {
    "Air Cooler": [
      { name: "Installation", price: "₹500", duration: "1 hour", description: "Setup and testing included" },
      { name: "General Service", price: "₹399", duration: "1 hour", description: "Complete cleaning and maintenance" },
      { name: "Pad Replacement", price: "₹299", duration: "30 minutes", description: "High-quality cooling pad replacement" },
      { name: "Motor Repair", price: "₹699", duration: "1-2 hours", description: "Expert motor repair service" }
    ],
    // ... other categories remain the same
  };

  // Function to add service with quantity
  const addService = (service, category) => {
    const existingService = selectedServices.find(
      s => s.name === service.name && s.category === category
    );

    if (existingService) {
      setSelectedServices(selectedServices.map(s => 
        s.name === service.name && s.category === category
          ? { ...s, quantity: s.quantity + 1 }
          : s
      ));
    } else {
      setSelectedServices([...selectedServices, { 
        ...service, 
        category,
        quantity: 1 
      }]);
    }
  };

  // Function to update quantity
  const updateQuantity = (index, increment) => {
    setSelectedServices(selectedServices.map((service, i) => {
      if (i === index) {
        const newQuantity = service.quantity + (increment ? 1 : -1);
        return newQuantity > 0 
          ? { ...service, quantity: newQuantity }
          : null;
      }
      return service;
    }).filter(Boolean));
  };

  const totalAmount = selectedServices.reduce((sum, service) => 
    sum + (service.price * service.quantity), 0
  );

  const renderServiceCard = (service, categoryName) => {
    const existingService = selectedServices.find(
      s => s.name === service.name && s.category === categoryName
    );
    const quantity = existingService?.quantity || 0;

    return (
      <div className="p-4 transition-shadow bg-white border rounded-lg hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{service.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">{service.duration}</span>
              </div>
              <div className="font-medium text-gray-900">₹{service.price}</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {quantity > 0 ? (
              <div className="flex items-center gap-2 p-1 border rounded-md">
                <button 
                  onClick={() => updateQuantity(selectedServices.indexOf(existingService), false)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => updateQuantity(selectedServices.indexOf(existingService), true)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addService(service, categoryName)}
                className="px-4 py-2 text-sm text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white whitespace-nowrap"
              >
                Add Service
              </button>
            )}
            {quantity > 0 && (
              <span className="text-sm font-medium text-gray-600">
                ₹{service.price * quantity}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAirConditionerServices = () => (
    <div className="space-y-4">
      {Object.entries(acServiceCategories).map(([categoryName, services]) => (
        <div key={categoryName} className="overflow-hidden border rounded-lg">
          <button
            onClick={() => setExpandedCategory(expandedCategory === categoryName ? null : categoryName)}
            className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100"
          >
            <span className="font-semibold">{categoryName}</span>
            {expandedCategory === categoryName ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedCategory === categoryName && (
            <div className="p-4 space-y-4 bg-gray-50">
              {services.map((service, idx) => (
                <div key={idx}>{renderServiceCard(service, categoryName)}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-3xl mx-4 my-6 bg-white rounded-lg shadow-xl">
        {/* Fixed header */}
        <div className="sticky top-0 z-10 p-6 bg-white border-b rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {category?.name} Services
              </h2>
              <p className="mt-1 text-sm text-gray-500">Select from our professional service options</p>
            </div>
            <div className="flex items-center gap-4">
              {totalAmount > 0 && (
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Amount</div>
                  <div className="text-xl font-bold">₹{totalAmount}</div>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-500 transition-colors rounded-full hover:text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6">
          {category?.name === "Air Conditioner" ? renderAirConditionerServices() : null}
        </div>

        {/* Proceed button */}
        {selectedServices.length > 0 && (
          <div className="sticky bottom-0 p-6 bg-white border-t">
            <button
              onClick={() => alert('Proceeding to checkout...')}
              className="w-full px-6 py-3 text-white transition-colors bg-black rounded-md hover:bg-gray-800"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceModal;