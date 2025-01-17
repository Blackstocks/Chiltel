import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { allCategories, stats } from './categoriesData';
import ErrorBoundary from './ErrorBoundary';

// Lazy load components
const AnimatedCounter = lazy(() => import('./AnimatedCounter'));
const TypewriterText = lazy(() => import('./TypewriterText'));

// Loading placeholder
const LoadingPlaceholder = () => (
  <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
);

const Hero = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        // Find matching categories
        const matchingCategories = allCategories.filter(category =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.mainCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Create split results for purchase and service
        const splitResults = matchingCategories.flatMap(category => [
          {
            ...category,
            resultType: "purchase",
            displayText: `${category.name} (Purchase)`,
            url: `/products/${category.name.toLowerCase().replace(/\s+/g, "-")}?type=purchase`
          },
          {
            ...category,
            resultType: "service",
            displayText: `${category.name} (Service)`,
            url: "/collection"
          }
        ]);

        setSuggestions(splitResults);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Preload hero image
  useEffect(() => {
    const img = new Image();
    img.src = "/assets/home.webp";
    img.onload = () => setIsImageLoaded(true);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    navigate(suggestion.url);
    setShowSuggestions(false);
    setSearchTerm("");
  };

  return (
    <div className="container px-4 mx-auto max-w-7xl">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-20">
        {/* Right Column - Image (Moved up for faster LCP) */}
        <div className="relative order-1 w-full lg:order-2">
          <div className="w-full h-56 overflow-hidden rounded-lg sm:h-64 md:h-80 lg:h-full">
            <img
              src="/assets/home.webp"
              alt="Home Appliance Professional"
              width="800"
              height="600"
              className={`w-full h-full object-cover lg:object-contain transition-opacity duration-300 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>

        {/* Left Column - Text Content */}
        <div className="flex flex-col justify-center order-2 py-4 space-y-4 lg:order-1 sm:py-6 md:py-8 lg:py-12 sm:space-y-5 md:space-y-6">
          <ErrorBoundary>
            <Suspense fallback={<LoadingPlaceholder />}>
              <TypewriterText />
            </Suspense>
          </ErrorBoundary>

          {/* Search Box */}
          <div className="relative w-full max-w-xl search-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search appliances"
              role="searchbox"
            />
            <button
              onClick={() => {
                if (searchTerm.trim() && suggestions.length > 0) {
                  handleSuggestionClick(suggestions[0]);
                }
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 text-sm sm:text-base text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
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
                    className="flex items-center justify-between px-4 py-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded">
                        <img
                          src={suggestion.image}
                          alt={suggestion.name}
                          className="object-cover w-8 h-8 rounded"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{suggestion.name}</div>
                        <div className="text-sm">{suggestion.resultType === "purchase" ? "Purchase" : "Service"}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{suggestion.type}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {allCategories.slice(0, 6).map((category) => (
              <div
                key={category.name}
                className="block p-2.5 sm:p-3 md:p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 cursor-pointer transition-all"
                onClick={() => navigate("/collection")}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center gap-2 sm:gap-2 md:gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <img
                      src={category.image}
                      alt={`${category.name} icon`}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                      loading="lazy"
                      width="56"
                      height="56"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-800 sm:text-base md:text-lg">
                    {category.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <ErrorBoundary>
            <Suspense fallback={<LoadingPlaceholder />}>
              <div className="grid grid-cols-3 gap-2 pt-2 sm:gap-3 md:gap-4 lg:gap-6 sm:pt-4">
                {stats.map((stat) => (
                  <div key={stat.text} className="flex items-start gap-1.5 sm:gap-1.5 md:gap-2">
                    <div className={`p-1.5 sm:p-1.5 md:p-2 rounded-lg bg-${stat.color}-50`}>
                      <svg
                        className={`w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-6 lg:h-6 text-${stat.color}-600`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Suspense fallback={<span>0</span>}>
                          <span className="text-base font-bold text-gray-900 sm:text-lg md:text-xl lg:text-2xl">
                            <AnimatedCounter end={stat.end} duration={1500} />
                          </span>
                        </Suspense>
                        <span className="text-base font-bold text-gray-900 sm:text-base md:text-lg lg:text-xl">+</span>
                      </div>
                      <span className="text-xs text-gray-600 sm:text-sm md:text-base">{stat.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default Hero;