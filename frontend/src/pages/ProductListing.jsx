// src/pages/ProductListing.jsx
import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const ProductListing = ({ category, type }) => {
  const products = {
    "Air Conditioner": [
      {
        id: 1,
        name: "Carrier 1.5 Ton 5 Star AI Flexicool Inverter Split AC",
        image: "/assets/products/ac1.jpg",
        originalPrice: "₹67,990",
        discountedPrice: "₹32,999",
        discount: "51%",
        description: "Split AC with Flexicool Inverter Compressor: Variable Speed (Dual Inverter) Auto Cleanser: Yes Copper Condenser Coil: Better cooling and requires low maintenance 2023 Model",
        rating: 4.5,
        reviews: 2584,
        brand: "Carrier",
        features: [
          "1.5 Ton Capacity", 
          "5 Star Rating",
          "Auto Cleansing",
          "Dual Inverter"
        ]
      },
      {
        id: 2,
        name: "Daikin 1.5 Ton 3 Star Inverter Split AC",
        image: "/assets/products/ac2.jpg",
        originalPrice: "₹55,990",
        discountedPrice: "₹39,990",
        discount: "29%",
        description: "Split AC with Inverter Compressor: Variable Speed Copper Condenser Coil: Better cooling and requires low maintenance PM 2.5 Filter: Yes 2023 Model",
        rating: 4.3,
        reviews: 1876,
        brand: "Daikin",
        features: [
          "1.5 Ton Capacity",
          "3 Star Rating",
          "PM 2.5 Filter",
          "Copper Coil"
        ]
      },
      // Add more products as needed
    ],
    // Add more categories as needed
  };

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
        <span className="ml-2 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{category} - {type}</h1>
        <p className="mt-2 text-gray-600">Showing {products[category]?.length || 0} results</p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Filters Section */}
        <aside className="col-span-12 md:col-span-3">
          <div className="p-4 border rounded-lg">
            <h2 className="mb-4 text-lg font-semibold">Filters</h2>
            
            <div className="mb-4">
              <h3 className="mb-2 font-medium">Brand</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Carrier</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Daikin</span>
                </label>
                {/* Add more brands */}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-medium">Price Range</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Under ₹30,000</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>₹30,000 - ₹50,000</span>
                </label>
                {/* Add more price ranges */}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-medium">Rating</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>4★ & above</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>3★ & above</span>
                </label>
                {/* Add more ratings */}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Section */}
        <main className="col-span-12 md:col-span-9">
          <div className="space-y-6">
            {products[category]?.map((product) => (
              <div key={product.id} className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md">
                <div className="grid grid-cols-12 gap-6">
                  {/* Product Image */}
                  <div className="col-span-12 md:col-span-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="object-contain w-full h-48"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="col-span-12 md:col-span-9">
                    <h2 className="mb-2 text-xl font-medium">{product.name}</h2>
                    
                    <div className="flex items-center mb-2 space-x-4">
                      <RatingStars rating={product.rating} />
                      <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                    </div>

                    <div className="mb-2">
                      <span className="text-2xl font-bold text-gray-900">{product.discountedPrice}</span>
                      <span className="ml-2 text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      <span className="ml-2 text-sm font-medium text-green-600">Save {product.discount}</span>
                    </div>

                    <p className="mb-4 text-gray-600">{product.description}</p>

                    <div className="mb-4">
                      <h3 className="mb-2 font-medium">Key Features:</h3>
                      <ul className="pl-5 space-y-1 list-disc">
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-4">
                      <button className="px-6 py-2 text-white transition-all duration-300 bg-black rounded-md hover:bg-gray-800">
                        Buy Now
                      </button>
                      <button className="px-6 py-2 text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductListing;