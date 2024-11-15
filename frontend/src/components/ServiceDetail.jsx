// src/components/ServiceDetail.js

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: "Air Conditioner", mainCategory: "Appliance", type: "Cooling", image: "/assets/air_conditioner.jpeg", description: "Professional AC services including installation, repair, and maintenance", price: 2999 },
    { id: 2, name: "Water Purifier", mainCategory: "Appliance", type: "Water", image: "/assets/water_purifier.jpeg", description: "Expert water purifier installation and maintenance services", price: 1999 },
    { id: 3, name: "Geyser", mainCategory: "Appliance", type: "Heating", image: "/assets/geyser.jpg", description: "Comprehensive geyser repair and installation services", price: 2500 },
    // Add more products as needed
  ];

  const product = categories.find((item) => item.id === parseInt(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container p-4 mx-auto">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
        &larr; Back
      </button>
      <div className="flex flex-col mt-4 md:flex-row">
        <div className="md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full rounded-md"
          />
        </div>
        <div className="p-4 md:w-1/2">
          <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
          <p className="mb-4 text-2xl text-red-500">₹{product.price}</p>
          <p className="mb-4">{product.description}</p>
          <button className="px-4 py-2 mb-4 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-600">
            Add to Cart
          </button>
          <button className="px-4 py-2 font-bold text-white bg-orange-500 rounded hover:bg-orange-600">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
