import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KitchenAppliances = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      name: "Water Cooler",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      image: "/assets/wcooler.jpeg",
      description: "Commercial water cooler for professional use",
      url: "/collection"
    },
    {
      name: "Upright Chiller",
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547",
      image: "/assets/uchiller.jpeg",
      description: "Professional upright chiller for commercial use",
      url: "/collection"
    },
    {
      name: "Under Counter",
      icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
      image: "/assets/ucounter.jpg",
      description: "Space-saving under counter chiller",
      url: "/collection"
    },
    {
      name: "Back Bar Chiller",
      icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
      image: "/assets/bbchiler.jpeg",
      description: "Efficient back bar chiller for beverages",
      url: "/collection"
    },
    {
      name: "Food Prep Chiller",
      icon: "M7 2v11m0 0a2 2 0 104 0m-4 0a2 2 0 114 0m5-11v11m0 0a2 2 0 104 0m-4 0a2 2 0 114 0",
      image: "/assets/fprep.jpeg",
      description: "Food preparation chiller for professional kitchens",
      url: "/collection"
    },
    {
      name: "Ice Cube",
      icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4",
      image: "/assets/icube.jpg",
      description: "Commercial ice cube maker",
      url: "/collection" 
    },
  ];

  const totalItems = categories.length;
  const duplicatedCategories = [...categories, ...categories];
  const [visibleItems, setVisibleItems] = useState(4);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(window.innerWidth < 640 ? 1 : 4);
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, 3000);

    return () => clearInterval(timer);
  }, [totalItems]);

  const handlePurchase = (url) => {
    navigate(url);
  };

  return (
    <div className="container max-w-full mx-auto overflow-hidden">
      <div className="py-8 text-3xl text-center">
        <h2 className="text-3xl">
          <span className="text-gray-500">KITCHEN</span>{" "}
          <span className="text-gray-900">APPLIANCES</span>
        </h2>
        <p className="w-3/4 m-auto text-lg text-gray-600">
          Professional kitchen equipment for commercial and industrial use.
        </p>
      </div>

      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${(activeIndex % totalItems) * (100 / visibleItems)}%)`,
        }}
      >
        {duplicatedCategories.map((category, index) => (
          <div key={index} className="flex-shrink-0 w-full p-2 sm:w-1/4">
            <div className="overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg h-[400px] flex flex-col">
              <div 
                className="relative h-[60%] overflow-hidden group cursor-pointer"
                onClick={() => handlePurchase(category.url)}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/40 group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={category.icon}
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4 h-[40%] flex flex-col justify-between">
                <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
                  {category.name}
                </h3>
                <p className="text-sm text-center text-gray-600">
                  {category.description}
                </p>
                <div className="flex justify-center mt-4">
                  <button 
                    onClick={() => handlePurchase(category.url)}
                    className="w-1/2 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Service Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div 
        className="flex justify-center my-8 cursor-pointer"
        onClick={() => navigate('/collection')}
      >
        <img
          src={isMobile ? "/assets/2.webp" : "/assets/2.webp"}
          alt="Kitchen Appliances Banner"
          className="object-cover w-full transition-transform duration-500 ease-in-out max-h-80 hover:scale-105 hover:shadow-lg"
        />
      </div>
    </div>
  );
};

export default KitchenAppliances;