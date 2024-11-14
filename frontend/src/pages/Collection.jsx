import React, { useState, useEffect } from 'react';

const ServiceCollection = () => {
  const categories = [
    { name: "Air Conditioner", type: "Appliance", image: "/assets/air_conditioner.jpeg", description: "Professional AC services..." },
    { name: "Water Purifier", type: "Appliance", image: "/assets/water_purifier.jpeg", description: "Expert water purifier services..." },
    { name: "Deep Freezer", type: "Retail", image: "/assets/deep_freeze.png", description: "High-quality deep freezers..." },
    // add more categories as needed
  ];

  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [sortType, setSortType] = useState('name'); // default sorting by name

  // Filter categories based on selected filters
  const filterCategories = () => {
    let updatedCategories = categories;

    if (categoryFilter.length > 0) {
      updatedCategories = updatedCategories.filter(cat => categoryFilter.includes(cat.type));
    }

    setFilteredCategories(updatedCategories);
  };

  // Sort categories based on selected sorting type
  const sortCategories = () => {
    let sortedCategories = [...filteredCategories];
    
    sortedCategories = sortedCategories.sort((a, b) =>
      sortType === 'name' ? a.name.localeCompare(b.name) : 0 // add other sorting logic if needed
    );

    setFilteredCategories(sortedCategories);
  };

  // Update filters and sorting on category selection or sort change
  useEffect(() => {
    filterCategories();
  }, [categoryFilter]);

  useEffect(() => {
    sortCategories();
  }, [sortType, filteredCategories]);

  const toggleCategory = (category) => {
    setCategoryFilter(prev =>
      prev.includes(category) ? prev.filter(cat => cat !== category) : [...prev, category]
    );
  };

  return (
    <div className="container max-w-full mx-auto overflow-hidden">
      <div className="py-8 text-center">
        <h2 className="text-3xl"><span className="text-gray-500">OUR</span> <span className="text-gray-900">SERVICES</span></h2>
        <p className="text-base text-gray-600">Explore our range of services tailored to meet your needs.</p>
      </div>

      {/* Filter and Sort Section */}
      <div className="flex gap-6 mb-6">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium">Filters</h3>
          <label><input type="checkbox" value="Appliance" onChange={() => toggleCategory("Appliance")} /> Appliance</label>
          <label><input type="checkbox" value="Retail" onChange={() => toggleCategory("Retail")} /> Retail</label>
        </div>
        
        <div>
          <label>Sort By: 
            <select onChange={(e) => setSortType(e.target.value)} className="p-1 ml-2 border">
              <option value="name">Name</option>
              {/* Add more sort options if needed */}
            </select>
          </label>
        </div>
      </div>

      {/* Service Category Grid */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {filteredCategories.map((category, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
            <img src={category.image} alt={category.name} className="object-cover w-full h-48 mb-4 rounded-md"/>
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
            <button className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700">Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCollection;
