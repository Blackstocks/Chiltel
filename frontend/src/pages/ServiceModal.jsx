import React from 'react';

const ServiceModal = ({ isOpen, onClose, category }) => {
  if (!isOpen) return null;

  // Service mappings for each category with Indian market pricing
  const serviceDetails = {
    "Air Conditioner": [
      { name: "Installation", price: "₹2,000", duration: "2-3 hours", description: "Professional installation with warranty" },
      { name: "General Service", price: "₹799", duration: "1-2 hours", description: "Complete cleaning and performance check" },
      { name: "Gas Refilling", price: "₹1,500", duration: "1 hour", description: "Refrigerant top-up with leak check" },
      { name: "Deep Cleaning", price: "₹1,299", duration: "2-3 hours", description: "Thorough cleaning of all components" },
      { name: "Repair", price: "Inspection based", duration: "Varies", description: "Expert diagnosis and repair service" }
    ],
    "Air Cooler": [
      { name: "Installation", price: "₹500", duration: "1 hour", description: "Setup and testing included" },
      { name: "General Service", price: "₹399", duration: "1 hour", description: "Complete cleaning and maintenance" },
      { name: "Pad Replacement", price: "₹299", duration: "30 minutes", description: "High-quality cooling pad replacement" },
      { name: "Motor Repair", price: "₹699", duration: "1-2 hours", description: "Expert motor repair service" }
    ],
    "Water Purifier": [
      { name: "Installation", price: "₹599", duration: "1 hour", description: "Professional setup with testing" },
      { name: "Filter Replacement", price: "₹999", duration: "30 minutes", description: "Genuine filter replacement" },
      { name: "General Service", price: "₹499", duration: "1 hour", description: "Complete cleaning and sanitization" },
      { name: "UV Lamp Replacement", price: "₹799", duration: "30 minutes", description: "UV lamp replacement with testing" }
    ],
    "Geyser": [
      { name: "Installation", price: "₹799", duration: "1-2 hours", description: "Safe installation with testing" },
      { name: "Repair", price: "₹599", duration: "1 hour", description: "Expert troubleshooting and repair" },
      { name: "Thermostat Replacement", price: "₹499", duration: "1 hour", description: "Genuine part replacement" },
      { name: "General Service", price: "₹399", duration: "1 hour", description: "Complete check and maintenance" }
    ],
    "Microwave": [
      { name: "General Service", price: "₹599", duration: "1 hour", description: "Complete cleaning and testing" },
      { name: "Repair", price: "Inspection based", duration: "Varies", description: "Professional repair service" },
      { name: "Magnetron Replacement", price: "₹2,499", duration: "1-2 hours", description: "Genuine part replacement" }
    ],
    "Refrigerator": [
      { name: "General Service", price: "₹799", duration: "1-2 hours", description: "Complete cleaning and maintenance" },
      { name: "Gas Refilling", price: "₹1,999", duration: "1-2 hours", description: "Gas charging with leak test" },
      { name: "Repair", price: "Inspection based", duration: "Varies", description: "Expert diagnosis and repair" },
      { name: "Door Seal Replacement", price: "₹699", duration: "1 hour", description: "Quality seal replacement" }
    ],
    "Washing Machine": [
      { name: "Installation", price: "₹699", duration: "1 hour", description: "Professional setup with testing" },
      { name: "General Service", price: "₹599", duration: "1-2 hours", description: "Complete cleaning and maintenance" },
      { name: "Repair", price: "Inspection based", duration: "Varies", description: "Expert repair service" },
      { name: "Belt Replacement", price: "₹399", duration: "1 hour", description: "Genuine belt replacement" }
    ],
    "default": [
      { name: "Installation", price: "Inspection based", duration: "Varies", description: "Professional installation service" },
      { name: "General Service", price: "Inspection based", duration: "Varies", description: "Complete maintenance service" },
      { name: "Repair", price: "Inspection based", duration: "Varies", description: "Expert repair service" }
    ]
  };

  const getServicesForCategory = (categoryName) => {
    return serviceDetails[categoryName] || serviceDetails.default;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black bg-opacity-50">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between pb-4 mb-6 border-b">
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
          
          <div className="space-y-4">
            {getServicesForCategory(category?.name).map((service, index) => (
              <div
                key={index}
                className="relative p-4 transition-all border rounded-lg hover:shadow-md bg-gray-50 hover:bg-white"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{service.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{service.duration}</span>
                      </div>
                      <div className="font-medium text-gray-900">
                        {service.price}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      alert(`Booking ${service.name} for ${category?.name}`);
                    }}
                    className="px-4 py-2 text-sm text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white whitespace-nowrap"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;