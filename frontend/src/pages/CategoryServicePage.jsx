import React, { useState } from "react";
import { ArrowLeft, Clock, Check, AlertCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const CategoryServicePage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);
  const [filter, setFilter] = useState("All");

  const servicesByCategory = {
    "air-conditioner": {
      title: "Air Conditioner Services",
      groupedServices: {
        "Gas Charging Services": [
          {
            id: 1,
            name: "GAS CHARGING (WINDOW AC) 2 TON",
            description:
              "Book for Gas Refilling & Rectification of Unit. Spares Parts Replacement are available as per 'Actual Rate'.",
            features: [
              "Fixed & Affordable Charges for AC Repairing",
              "Branded & Genuine Spares Parts",
              "Fast Repairing by Skilled Technicians",
              "Online payment warranty",
            ],
            duration: "2-3 hours",
            warranty: "Valid for Prepaid ONLINE Full Payment Only",
            options: [
              { name: "CALL ATTENDING", price: 550, discountPrice: 539 },
              { name: "GAS CHARGING", price: 4500, discountPrice: 4410 },
              { name: "GAS TOP-UP", price: 3500, discountPrice: 3430 },
            ],
          },
          {
            id: 2,
            name: "GAS CHARGING (WINDOW AC) 2 TON R-22",
            description:
              "Book for Gas Refilling & Rectification of Unit with R-22 refrigerant.",
            features: [
              "R-22 gas refilling",
              "Pressure testing",
              "Performance optimization",
              "Leak detection",
            ],
            duration: "2-3 hours",
            warranty: "Valid for Prepaid ONLINE Payment",
            options: [
              { name: "CALL ATTENDING", price: 550, discountPrice: 539 },
              { name: "GAS CHARGING R-22", price: 3000, discountPrice: 2940 },
              { name: "GAS TOP-UP", price: 2000, discountPrice: 1960 },
            ],
          },
          {
            id: 3,
            name: "GAS CHARGING (WINDOW AC) Up to 1.5 TON R-32",
            description:
              "Book for Gas Refilling & Rectification of Unit. Spares Parts Replacement are available as per 'Actual Rate'.",
            features: [
              "R-32 gas refilling",
              "Suitable for 1.5 TON units",
              "Performance testing",
              "Professional service",
            ],
            duration: "2-3 hours",
            warranty: "Prepaid online payment warranty",
            options: [
              { name: "ATTENDING CHARGE", price: 550, discountPrice: 539 },
              { name: "GAS CHARGING R-32", price: 3300, discountPrice: 3234 },
              { name: "GAS TOP-UP R-32", price: 2300, discountPrice: 2254 },
            ],
          },
        ],
        "Cleaning and Maintenance Services": [
          {
            id: 5,
            name: "WITH FOAM & JET PUMP SERVICE (WINDOW AC)",
            description:
              "Book your AC Servicing. Optimize machines every 6 months with effortless dirt removal for superior cooling efficiency.",
            features: [
              "90-min jet service with fault check",
              "Superior cooling efficiency",
              "Effortless dirt removal",
              "Complete AC maintenance",
            ],
            duration: "90 minutes",
            warranty: "Standard warranty applies",
            options: [
              {
                name: "JET PUMP SERVICE (WINDOW AC)",
                price: 650,
                discountPrice: 617,
              },
              {
                name: "With Foam & Jet Pump Service",
                price: 750,
                discountPrice: 712,
              },
            ],
          },
          {
            id: 6,
            name: "DRY SERVICE (WINDOW AC)",
            description:
              "Book now to keep your AC in top-notch condition! Revitalize Your AC with Our Dry AC Service (Window).",
            features: [
              "Ideal for machines serviced within 2 months",
              "Swift 40-minute Air Blower Service",
              "Minor fault checks included",
              "Basic maintenance service",
            ],
            duration: "40 minutes",
            warranty: "For machines serviced within 2 months",
            options: [
              { name: "DRY SERVICE (WINDOW AC)", price: 550, discountPrice: 495 },
              {
                name: "WITH JET PUMP SERVICE (WINDOW AC)",
                price: 650,
                discountPrice: 617,
              },
              {
                name: "WITH FOAM & JET PUMP SERVICE (WINDOW AC)",
                price: 750,
                discountPrice: 712,
              },
            ],
          },
        ],
        "Installation Services": [
          {
            id: 7,
            name: "INSTALLATION (WINDOW AC)",
            description:
              "Book Now to Install your AC. Professional installation service with complete setup.",
            features: [
              "Professional installation",
              "Complete testing",
              "Performance verification",
              "Expert technicians",
            ],
            duration: "2-3 hours",
            warranty: "Installation warranty",
            options: [
              {
                name: "INSTALLATION FEES FIXED",
                price: 700,
                discountPrice: 700,
              },
              { name: "JET SERVICE FIXED", price: 550, discountPrice: 650 },
              {
                name: "GAS TOP-UP (R-22) FIXED",
                price: 1300,
                discountPrice: 1300,
              },
              { name: "REPAIR VISIT FEES FIXED", price: 550, discountPrice: 550 },
            ],
          },
        ],
      },
    },
  };
  

  const categoryData = servicesByCategory[category];

  const toggleService = (option, serviceId) => {
    setSelectedServices((prev) => {
      const serviceKey = `${serviceId}-${option.name}`;
      const exists = prev.find((s) => s.key === serviceKey);
      if (exists) {
        return prev.filter((s) => s.key !== serviceKey);
      }
      return [...prev, { ...option, key: serviceKey, serviceId }];
    });
  };

  const calculateTotal = () => {
    return selectedServices.reduce(
      (total, service) => total + service.discountPrice,
      0
    );
  };

  const handleProceedToBook = () => {
    navigate("/checkout");
  };

  if (!categoryData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-700">
            Category not found
          </h2>
          <button
            onClick={() => navigate("/collection")}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Return To Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container flex items-center justify-between px-4 py-5 mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-semibold">{categoryData.title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container flex flex-wrap-reverse gap-8 px-4 py-8 mx-auto lg:flex-nowrap">
        {/* Services Section */}
        <div className="flex-1 space-y-12">
          {Object.entries(categoryData.groupedServices)
            .filter(([group]) => filter === "All" || filter === group)
            .map(([group, services]) => (
              <div key={group}>
                <h2 className="mb-6 text-2xl font-bold text-gray-700">{group}</h2>
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex p-6 mb-6 bg-white rounded-lg shadow-md"
                  >
                    <div className="flex-1 pr-6">
                      <h3 className="mb-2 text-xl font-semibold">
                        {service.name}
                      </h3>
                      <p className="mb-4 text-gray-600">
                        {service.description}
                      </p>
                      <div className="grid grid-cols-2 mb-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          <span>{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          <span>{service.warranty}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold">Features:</h4>
                        <ul className="text-gray-600">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex-1 pl-6 border-l">
                      <h4 className="mb-4 font-semibold">Service Options:</h4>
                      <div className="space-y-3">
                        {service.options.map((option) => (
                          <div
                            key={option.name}
                            className="flex items-center justify-between px-3 py-2 border rounded-lg hover:shadow"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedServices.some(
                                  (s) =>
                                    s.key === `${service.id}-${option.name}`
                                )}
                                onChange={() =>
                                  toggleService(option, service.id)
                                }
                                className="w-5 h-5"
                              />
                              <span>{option.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-400 line-through">
                                ₹{option.price}
                              </span>
                              <span className="ml-2 font-semibold text-blue-600">
                                ₹{option.discountPrice}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>

        {/* Sidebar */}
        <div className="w-full space-y-6 lg:w-1/3">
          {/* Filter */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 font-semibold text-gray-700">Filter Services</h3>
            <select
              className="w-full px-4 py-2 border rounded-lg shadow bg-gray-50"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Services</option>
              {Object.keys(categoryData.groupedServices).map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* Cart Summary */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Selected Services</h2>
            {selectedServices.length === 0 ? (
              <p className="text-gray-600">No services selected.</p>
            ) : (
              <>
                <ul className="space-y-2">
                  {selectedServices.map((service) => (
                    <li key={service.key} className="flex justify-between">
                      <span>{service.name}</span>
                      <span>₹{service.discountPrice}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 mt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
              </>
            )}
            <button
              className="w-full py-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={selectedServices.length === 0}
              onClick={handleProceedToBook}
            >
              Proceed to Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryServicePage;
