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
        name: "Basic Service",
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
        name: "Gas Refill",
        price: 1500,
        duration: "1-2 hours",
        description: "Complete gas charging with leak test" 
      }
    ],
    "Repair": [
      { 
        name: "Repair Visit",
        price: 499,
        duration: "30-60 minutes",
        description: "Diagnosis and minor repairs" 
      },
      { 
        name: "PCB Repair",
        price: 1200,
        duration: "1-2 hours",
        description: "Circuit board repair and testing" 
      }
    ]
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

  const renderServiceCard = (service, categoryName) => (
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
        <button
          onClick={() => addService(service, categoryName)}
          className="px-4 py-2 text-sm text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white whitespace-nowrap"
        >
          Add Service
        </button>
      </div>
    </div>
  );

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

  const totalAmount = selectedServices.reduce((sum, service) => 
    sum + (service.price * service.quantity), 0
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

        {/* Scrollable content */}
        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6">
          {category?.name === "Air Conditioner" ? renderAirConditionerServices() : null}

          {/* Selected Services Summary */}
          {selectedServices.length > 0 && (
            <div className="pt-6 mt-6 border-t">
              <h3 className="mb-4 text-lg font-semibold">Selected Services</h3>
              <div className="space-y-3">
                {selectedServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex-grow">
                      <span className="font-medium">{service.name}</span>
                      <span className="ml-2 text-sm text-gray-500">({service.category})</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(index, false)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{service.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(index, true)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="font-semibold min-w-[80px] text-right">
                        ₹{service.price * service.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fixed footer with total and checkout */}
        {selectedServices.length > 0 && (
          <div className="sticky bottom-0 p-6 bg-white border-t">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-xl font-bold">₹{totalAmount}</span>
            </div>
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