// src/components/ServiceCollection.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceCollection = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: "Air Conditioner", mainCategory: "Appliance", type: "Cooling", image: "/assets/air_conditioner.jpeg", description: "Professional AC services including installation, repair, and maintenance" },
    { id: 2, name: "Water Purifier", mainCategory: "Appliance", type: "Water", image: "/assets/water_purifier.jpeg", description: "Expert water purifier installation and maintenance services" },
    { id: 3, name: "Geyser", mainCategory: "Appliance", type: "Heating", image: "/assets/geyser.jpg", description: "Comprehensive geyser repair and installation services" },
    { id: 4, name: "Microwave", mainCategory: "Appliance", type: "Cooking", image: "/assets/microwave.jpeg", description: "Expert microwave repair and maintenance services" },
    { id: 5, name: "Refrigerator", mainCategory: "Appliance", type: "Cooling", image: "/assets/refrigerator.jpeg", description: "Professional refrigerator repair and maintenance services" },
    { id: 6, name: "Washing Machine", mainCategory: "Appliance", type: "Cleaning", image: "/assets/washing_machine.jpeg", description: "Expert washing machine repair and maintenance services" },
    { id: 7, name: "Deep Freezer", mainCategory: "Retail", type: "Cooling", image: "/assets/deep_freeze.png", description: "High-quality deep freezers for your storage needs." },
    { id: 8, name: "Visi Cooler", mainCategory: "Retail", type: "Cooling", image: "/assets/visi_cooler.png", description: "Reliable visi coolers for commercial use." },
    { id: 9, name: "Cassette AC", mainCategory: "Retail", type: "Cooling", image: "/assets/cassette_ac.jpg", description: "Efficient cooling with cassette air conditioners." },
    { id: 10, name: "Water Cooler Cum Purifier", mainCategory: "Retail", type: "Water", image: "/assets/water_cooler.jpg", description: "Dual-function water cooler and purifier." },
    { id: 11, name: "Water Dispenser", mainCategory: "Retail", type: "Water", image: "/assets/water_dispenser.jpg", description: "Convenient and portable water dispensers." },
    { id: 12, name: "Display Counter", mainCategory: "Retail", type: "Display", image: "/assets/display_counter.png", description: "Attractive display counters for showcasing products." },
  ];

  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [mainCategoryFilter, setMainCategoryFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState([]);
  const [sortType, setSortType] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const toggleMainCategory = (category) => {
    setMainCategoryFilter(prev => (prev === category ? null : category));
    setTypeFilter([]);
  };

  const toggleType = (type) => {
    setTypeFilter(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filterCategories = () => {
    let updatedCategories = categories;
    if (mainCategoryFilter) {
      updatedCategories = updatedCategories.filter(cat => cat.mainCategory === mainCategoryFilter);
    }
    if (typeFilter.length > 0) {
      updatedCategories = updatedCategories.filter(cat => typeFilter.includes(cat.type));
    }
    setFilteredCategories(updatedCategories);
  };

  const sortCategories = () => {
    let sortedCategories = [...filteredCategories];
    sortedCategories.sort((a, b) =>
      sortType === 'name' ? a.name.localeCompare(b.name) : 0
    );
    setFilteredCategories(sortedCategories);
  };

  useEffect(() => {
    filterCategories();
  }, [mainCategoryFilter, typeFilter]);

  useEffect(() => {
    sortCategories();
  }, [sortType, filteredCategories]);

  return (
    <div className="container px-4 py-8 mx-auto">
      <header className="flex items-center justify-between pb-4 mb-8 border-b">
        <h1 className="text-3xl font-bold">ALL COLLECTIONS</h1>
        <div>
          <label className="text-gray-700">Sort by: </label>
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="p-2 ml-2 border border-gray-300 rounded"
          >
            <option value="name">Relevance</option>
          </select>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        <aside className={`md:w-1/4 md:pr-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="p-4 mb-6 border rounded-lg">
            <h3 className="mb-4 text-lg font-semibold">MAIN CATEGORY</h3>
            <div className="flex flex-col space-y-2">
              <label>
                <input type="radio" name="mainCategory" checked={mainCategoryFilter === "Appliance"} onChange={() => toggleMainCategory("Appliance")} /> Appliance
              </label>
              <label>
                <input type="radio" name="mainCategory" checked={mainCategoryFilter === "Retail"} onChange={() => toggleMainCategory("Retail")} /> Retail
              </label>
            </div>
          </div>

          {mainCategoryFilter && (
            <div className="p-4 border rounded-lg">
              <h3 className="mb-4 text-lg font-semibold">TYPE</h3>
              <div className="flex flex-col space-y-2">
                {Array.from(new Set(categories.filter(cat => cat.mainCategory === mainCategoryFilter).map(cat => cat.type))).map(type => (
                  <label key={type}>
                    <input type="checkbox" onChange={() => toggleType(type)} /> {type}
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 mb-4 text-white bg-blue-600 rounded-md md:hidden hover:bg-blue-700"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <main className="md:w-3/4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <div key={category.id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-48 mb-4 rounded-md"
                />
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
                <button
                  className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  onClick={() => navigate(`/services/${category.id}`)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServiceCollection;
