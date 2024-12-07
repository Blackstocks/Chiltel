import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceCollection = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const categories = [
    { name: "Air Conditioner", mainCategory: "Appliance", type: "Cooling", image: "/assets/air_conditioner.jpeg", description: "Professional Split AC services including installation, repair, and maintenance" },
    { name: "Air Cooler", mainCategory: "Appliance", type: "Cooling", image: "/assets/cooler.jpg", description: "Professional air cooler services for optimal cooling performance" },
    { name: "Water Purifier", mainCategory: "Appliance", type: "Water", image: "/assets/water_purifier.jpeg", description: "Expert water purifier installation and maintenance services" },
    { name: "Geyser", mainCategory: "Appliance", type: "Heating", image: "/assets/geyser.jpg", description: "Comprehensive geyser repair and installation services" },
    { name: "Microwave", mainCategory: "Appliance", type: "Cooking", image: "/assets/microwave.jpeg", description: "Expert microwave repair and maintenance services" },
    { name: "Refrigerator", mainCategory: "Appliance", type: "Cooling", image: "/assets/refrigwrator.jpeg", description: "Professional refrigerator repair and maintenance services" }, // Fixed image name
    { name: "Washing Machine", mainCategory: "Appliance", type: "Cleaning", image: "/assets/washing_machine.jpeg", description: "Expert washing machine repair and maintenance services" },
    { name: "Deep Freezer", mainCategory: "Retail", type: "Cooling", image: "/assets/deep_freeze.png", description: "High-quality deep freezers for your storage needs." }, // Fixed image name
    { name: "Visi Cooler", mainCategory: "Retail", type: "Cooling", image: "/assets/Visi _Coole.png", description: "Reliable visi coolers for commercial use." }, // Fixed image name
    { name: "Cassette AC", mainCategory: "Retail", type: "Cooling", image: "/assets/Cassett.jpg", description: "Efficient cooling with cassette air conditioners." }, // Fixed image name
    { name: "Water Cooler Cum Purifier", mainCategory: "Retail", type: "Water", image: "/assets/water_cooler.jpg", description: "Dual-function water cooler and purifier." },
    { name: "Water Dispenser", mainCategory: "Retail", type: "Water", image: "/assets/Water-dis.jpg", description: "Convenient and portable water dispensers." }, // Fixed image name
    { name: "Display Counter", mainCategory: "Retail", type: "Display", image: "/assets/display-counter.png", description: "Attractive display counters for showcasing products." },
  ];

  const [mainCategoryFilter, setMainCategoryFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState([]);
  const [sortType, setSortType] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const toggleMainCategory = (category) => {
    setMainCategoryFilter(prev => (prev === category ? null : category));
    setTypeFilter([]);
  };

  const toggleType = (type) => {
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleButtonClick = (category, type) => {
    // Convert category name to URL-friendly format
    const categorySlug = category.toLowerCase().replace(/ /g, '-');
    navigate(`/products/${categorySlug}?type=${type}`);
  };

  // Combine filtering and sorting in a single useEffect
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    let updatedCategories = [...categories];

    // Apply main category filter
    if (mainCategoryFilter) {
      updatedCategories = updatedCategories.filter(
        (cat) => cat.mainCategory === mainCategoryFilter
      );
    }

    // Apply type filter
    if (typeFilter.length > 0) {
      updatedCategories = updatedCategories.filter(cat => typeFilter.includes(cat.type));
    }

    // Apply sorting
    if (sortType === 'name') {
      updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
    }
    // You can add more sort types here if needed

    setFilteredCategories(updatedCategories);
  }, [mainCategoryFilter, typeFilter, sortType, categories]);

  return (
    <div className="container px-4 py-8 mx-auto">
      <header className="flex items-center justify-between pb-4 mb-8 border-b">
        <h1 className="text-3xl font-bold">ALL COLLECTIONS</h1>
        <div>
          <label className="text-gray-700">Sort by: </label>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="p-2 ml-2 border border-gray-300 rounded"
          >
            <option value="name">Relevance</option>
            {/* Add more sort options if needed */}
          </select>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        <aside
          className={`md:w-1/4 md:pr-4 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <div className="p-4 mb-6 border rounded-lg">
            <h3 className="mb-4 text-lg font-semibold">MAIN CATEGORY</h3>
            <div className="flex flex-col space-y-2">
              <label>
                <input
                  type="radio"
                  name="mainCategory"
                  checked={mainCategoryFilter === "Appliance"}
                  onChange={() => toggleMainCategory("Appliance")}
                /> Appliance
              </label>
              <label>
                <input
                  type="radio"
                  name="mainCategory"
                  checked={mainCategoryFilter === "Retail"}
                  onChange={() => toggleMainCategory("Retail")}
                /> Retail
              </label>
            </div>
          </div>

          {mainCategoryFilter && (
            <div className="p-4 border rounded-lg">
              <h3 className="mb-4 text-lg font-semibold">TYPE</h3>
              <div className="flex flex-col space-y-2">
                {Array.from(
                  new Set(
                    categories
                      .filter((cat) => cat.mainCategory === mainCategoryFilter)
                      .map((cat) => cat.type)
                  )
                ).map((type) => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      checked={typeFilter.includes(type)}
                      onChange={() => toggleType(type)}
                    /> {type}
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 mb-4 text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white md:hidden"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        <main className="md:w-3/4">
          {filteredCategories.length === 0 ? (
            <p className="text-center text-gray-500">No categories found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-full h-48 mb-4 rounded-md"
                  />
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleButtonClick(category.name, 'purchase')}
                      className="flex-1 px-4 py-2 text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white"
                    >
                      Purchase
                    </button>
                    <button
                      onClick={() => handleButtonClick(category.name, 'service')}
                      className="flex-1 px-4 py-2 text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white"
                    >
                      Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ServiceCollection;
