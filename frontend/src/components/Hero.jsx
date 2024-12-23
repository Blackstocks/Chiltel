import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return count;
};

const TypewriterText = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "Expert Appliance\nSolutions at Your Doorstep";
  const typingSpeed = 100;
  const erasingSpeed = 30;
  const delayBeforeErasing = 2000;

  useEffect(() => {
    let timeout;

    if (isTyping) {
      if (text !== fullText) {
        timeout = setTimeout(() => {
          setText(fullText.slice(0, text.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, delayBeforeErasing);
      }
    } else {
      if (text) {
        timeout = setTimeout(() => {
          setText(text.slice(0, -1));
        }, erasingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(true);
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isTyping]);

  return (
    <div className="relative mb-2 sm:mb-3 md:mb-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-gray-900 whitespace-pre-line leading-tight min-h-[3em] sm:min-h-[2.75em] md:min-h-[3em]">
        {text}
        <span
          className="inline-block w-0.5 h-[1em] ml-[2px] -mb-1 bg-gray-900 animate-pulse"
          style={{ verticalAlign: "baseline" }}
        />
      </h1>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [showOptions, setShowOptions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Complete categories list
  const allCategories = [
    {
      name: "Air Conditioner",
      mainCategory: "Appliance",
      type: "Cooling",
      image: "/assets/air_conditioner.jpeg",
      description:
        "Professional Split AC services including installation, repair, and maintenance",
    },
    {
      name: "Air Cooler",
      mainCategory: "Appliance",
      type: "Cooling",
      image: "/assets/cooler.jpg",
      description:
        "Professional air cooler services for optimal cooling performance",
    },
    {
      name: "Air Purifier",
      mainCategory: "Domestic",
      type: "Cooling",
      image: "/assets/air_puri.jpg",
      description:
        "Professional air purifier services for optimal cooling performance",
    },
    {
      name: "Water Purifier",
      mainCategory: "Appliance",
      type: "Water",
      image: "/assets/water_purifier.jpeg",
      description:
        "Expert water purifier installation and maintenance services",
    },
    {
      name: "Geyser",
      mainCategory: "Appliance",
      type: "Heating",
      image: "/assets/geyser.jpg",
      description: "Comprehensive geyser repair and installation services",
    },
    {
      name: "Microwave",
      mainCategory: "Appliance",
      type: "Cooking",
      image: "/assets/microwave.jpeg",
      description: "Expert microwave repair and maintenance services",
    },
    {
      name: "Refrigerator",
      mainCategory: "Appliance",
      type: "Cooling",
      image: "/assets/refrigwrator.jpeg",
      description: "Professional refrigerator repair and maintenance services",
    },
    {
      name: "Washing Machine",
      mainCategory: "Appliance",
      type: "Cleaning",
      image: "/assets/washing_machine.jpeg",
      description: "Expert washing machine repair and maintenance services",
    },
    {
      name: "Deep Freezer",
      mainCategory: "Retail",
      type: "Cooling",
      image: "/assets/deep_freeze.png",
      description: "High-quality deep freezers for your storage needs.",
    },
    {
      name: "Visi Cooler",
      mainCategory: "Retail",
      type: "Cooling",
      image: "/assets/Visi _Coole.png",
      description: "Reliable visi coolers for commercial use.",
    },
    {
      name: "Cassette AC",
      mainCategory: "Retail",
      type: "Cooling",
      image: "/assets/Cassett.jpg",
      description: "Efficient cooling with cassette air conditioners.",
    },
    {
      name: "Water Cooler Cum Purifier",
      mainCategory: "Retail",
      type: "Water",
      image: "/assets/water_cooler.jpg",
      description: "Dual-function water cooler and purifier.",
    },
    {
      name: "Water Dispenser",
      mainCategory: "Retail",
      type: "Water",
      image: "/assets/Water-dis.jpg",
      description: "Convenient and portable water dispensers.",
    },
    {
      name: "Display Counter",
      mainCategory: "Retail",
      type: "Display",
      image: "/assets/display-counter.png",
      description: "Attractive display counters for showcasing products.",
    },
  ];

  // Featured categories for the grid
  const featuredCategories = allCategories.slice(0, 4);

  const stats = [
    {
      end: 15,
      text: "Years Experience",
      color: "blue",
      icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    },
    {
      end: 1500,
      text: "Happy Customers",
      color: "green",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      end: 30,
      text: "Expert Technicians",
      color: "purple",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    },
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      // Find matching categories
      const matchingCategories = allCategories.filter(
        (category) =>
          category.name.toLowerCase().includes(value.toLowerCase()) ||
          category.type.toLowerCase().includes(value.toLowerCase()) ||
          category.mainCategory.toLowerCase().includes(value.toLowerCase()) ||
          category.description.toLowerCase().includes(value.toLowerCase())
      );

      // Create split results for purchase and service
      const splitResults = matchingCategories.flatMap((category) => [
        {
          ...category,
          resultType: "purchase",
          displayText: `${category.name} (Purchase)`,
          url: `/products/${category.name
            .toLowerCase()
            .replace(/\s+/g, "-")}?type=purchase`,
        },
        {
          ...category,
          resultType: "service",
          displayText: `${category.name} (Service)`,
          url: "/collection",
        },
      ]);

      setSuggestions(splitResults);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchTerm.trim() && suggestions.length > 0) {
      navigate(suggestions[0].url);
      setShowSuggestions(false);
      setSearchTerm("");
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    navigate(suggestion.url);
    setShowSuggestions(false);
    setSearchTerm("");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handle option selection (service or purchase)
  const handleOptionSelect = (option) => {
    if (!selectedCategory) return;

    if (option === "service") {
      navigate("/collection");
    } else {
      const productUrl = `/products/${selectedCategory.name
        .toLowerCase()
        .replace(/\s+/g, "-")}?type=purchase`;
      navigate(productUrl);
    }
    setShowOptions(false);
    setSelectedCategory(null);
  };

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="container px-4 mx-auto max-w-7xl">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-20">
        {/* Left Column - Text Content */}
        <div className="flex flex-col justify-center order-2 py-4 space-y-4 lg:order-1 sm:py-6 md:py-8 lg:py-12 sm:space-y-5 md:space-y-6">
          <div>
            <TypewriterText />
            <p className="overflow-hidden text-sm text-gray-600 whitespace-normal sm:text-base md:text-lg lg:text-lg sm:whitespace-nowrap">
              Professional appliance solutions and services with certified
              technicians
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-xl search-container">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="What are you looking for?"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm sm:text-base sm:px-4 sm:py-3 md:px-6 md:py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="absolute px-3 py-1.5 text-sm sm:text-base text-white transform -translate-y-1/2 bg-blue-600 rounded-md sm:px-3 sm:py-1.5 md:px-6 md:py-2 right-2 top-1/2 hover:bg-blue-700 transition-colors"
            >
              Search
            </button>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.name}-${suggestion.resultType}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                      index !== suggestions.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1 rounded ${
                          suggestion.resultType === "purchase"
                        }`}
                      >
                        <img
                          src={suggestion.image}
                          alt={suggestion.name}
                          className="w-8 h-8 rounded"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {suggestion.name}
                        </div>
                        <div
                          className={`text-sm ${
                            suggestion.resultType === "purchase"
                          }`}
                        >
                          {suggestion.resultType === "purchase"
                            ? "Purchase"
                            : "Service"}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {suggestion.type}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {allCategories.slice(0, 4).map((category) => (
              <div
                key={category.name}
                className="block p-2.5 bg-white border border-gray-100 rounded-lg shadow-sm sm:p-3 md:p-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 sm:gap-2 md:gap-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <img
                        src={category.image}
                        alt={`${category.name} icon`}
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-800 sm:text-base md:text-lg">
                      {category.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2 sm:gap-3 md:gap-4 lg:gap-6 sm:pt-4">
            {stats.map(({ end, text, color, icon }) => (
              <div key={text} className="flex items-start gap-1.5 sm:gap-1.5 md:gap-2">
                <div className={`p-1.5 sm:p-1.5 md:p-2 rounded-lg bg-${color}-50`}>
                  <svg 
                    className={`w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 text-${color}-600`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={icon} 
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="text-base font-bold text-gray-900 sm:text-lg md:text-xl lg:text-2xl">
                      <AnimatedCounter end={end} duration={1500} />
                    </span>
                    <span className="text-base font-bold text-gray-900 sm:text-base md:text-lg lg:text-xl">+</span>
                  </div>
                  <span className="text-xs text-gray-600 sm:text-sm md:text-base">{text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="relative order-1 w-full lg:order-2">
          <div className="w-full h-56 overflow-hidden rounded-lg sm:h-64 md:h-80 lg:h-full">
            <img
              src="/assets/home.png"
              alt="Home Appliance Professional"
              className="object-cover w-full h-full lg:object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
