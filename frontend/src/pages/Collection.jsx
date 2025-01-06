import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ServiceModal from "./ServiceModal";
import { ShopContext } from "../context/ShopContext";

const categories = [
    {
        name: "Air Conditioner",
        mainCategory: "Domestic Appliance",
        type: "Cooling",
        image: "/assets/air_conditioner.jpeg",
        description: "Professional Split AC services including installation, repair, and maintenance",
    },
    {
        name: "Air Cooler",
        mainCategory: "Domestic Appliance",
        type: "Cooling",
        image: "/assets/cooler.jpg",
        description: "Professional air cooler services for optimal cooling performance",
    },
    {
        name: "Air Purifier",
        mainCategory: "Domestic Appliance",
        type: "Cooling",
        image: "/assets/air_puri.jpg",
        description: "Professional air purifier services for optimal cooling performance",
    },
    {
        name: "Water Purifier",
        mainCategory: "Domestic Appliance",
        type: "Water",
        image: "/assets/water_purifier.jpeg",
        description: "Expert water purifier installation and maintenance services",
    },
    {
        name: "Geyser",
        mainCategory: "Domestic Appliance",
        type: "Heating",
        image: "/assets/gey.png",
        description: "Comprehensive geyser repair and installation services",
    },
    {
        name: "Microwave",
        mainCategory: "Kitchen Appliance",
        type: "Cooking",
        image: "/assets/microwave.jpeg",
        description: "Expert microwave repair and maintenance services",
    },
    {
        name: "Refrigerator",
        mainCategory: "Domestic Appliance",
        type: "Cooling",
        image: "/assets/refrigwrator.jpeg",
        description: "Professional refrigerator repair and maintenance services",
    },
    {
        name: "Washing Machine",
        mainCategory: "Domestic Appliance",
        type: "Cleaning",
        image: "/assets/washing_machine.jpeg",
        description: "Expert washing machine repair and maintenance services",
    },
    {
        name: "Deep Freezer",
        mainCategory: "Retail Appliance",
        type: "Cooling",
        image: "/assets/deep_freeze.png",
        description: "High-quality deep freezers for your storage needs.",
    },
    {
        name: "Visi Cooler",
        mainCategory: "Retail Appliance",
        type: "Cooling",
        image: "/assets/Visi _Coole.png",
        description: "Reliable visi coolers for commercial use.",
    },
    {
        name: "Cassette AC",
        mainCategory: "Retail Appliance",
        type: "Cooling",
        image: "/assets/cas.webp",
        description: "Efficient cooling with cassette air conditioners.",
    },
    {
        name: "Water Cooler Cum Purifier",
        mainCategory: "Retail Appliance",
        type: "Water",
        image: "/assets/water_cooler.jpeg",
        description: "Dual-function water cooler and purifier.",
    },
    {
        name: "Water Dispenser",
        mainCategory: "Retail Appliance",
        type: "Water",
        image: "/assets/Water-dis.jpg",
        description: "Convenient and portable water dispensers.",
    },
    {
        name: "Display Counter",
        mainCategory: "Retail Appliance",
        type: "Display",
        image: "/assets/display-counter.jpeg",
        description: "Attractive display counters for showcasing products.",
    },
    {
        name: "Water Cooler",
        mainCategory: "Kitchen Appliance",
        type: "Cooling",
        image: "/assets/wcooler.jpeg",
        description: "Commercial water cooler for professional use",

      },
      {
        name: "Upright Chiller",
        mainCategory: "Kitchen Appliance",
        type: "Display",
        image: "/assets/uchiller.jpeg",
        description: "Professional upright chiller for commercial use",

      },
      {
        name: "Under Counter",
        mainCategory: "Kitchen Appliance",
        type: "Display",
        image: "/assets/ucounter.jpg",
        description: "Space-saving under counter chiller",

      },
      {
        name: "Back Bar Chiller",
        mainCategory: "Kitchen Appliance",
        type: "Display",
        image: "/assets/bbchiler.jpeg",
        description: "Efficient back bar chiller for beverages",

      },
      {
        name: "Food Prep Chiller",
        mainCategory: "Kitchen Appliance",
        type: "Display",
        image: "/assets/fprep.jpeg",
        description: "Food preparation chiller for professional kitchens",

      },
      {
        // name: "Ice Cube",
        name: "Ice Maker",
        mainCategory: "Kitchen Appliance",
        type: "Cooling",
        image: "/assets/icube.jpg",
        description: "Commercial ice cube maker",

      },
];

const ServiceCollection = () => {
    const { backendUrl, token } = useContext(ShopContext);
    const [mainCategoryFilter, setMainCategoryFilter] = useState(null);
    const [typeFilter, setTypeFilter] = useState([]);
    const [sortType, setSortType] = useState("name");
    const [showFilters, setShowFilters] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories1, setCategories1] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAndFormatData = async () => {
          try {
            // Fetch the product list from the API
            const response = await axios.get(backendUrl + '/api/product/list');
    
            if (response.data.success) {
              const products = response.data.data;
    
              // Extract unique categories
              const uniqueCategories = [];
              products.forEach((product) => {
                let localImage = "";

                // Map images based on category names
                switch (product.category) {
                  case "Air Conditioner":
                    localImage = "/assets/air_conditioner.jpeg";
                    break;
                  case "Air Cooler":
                    localImage = "/assets/cooler.jpg";
                    break;
                  case "Air Purifier":
                    localImage = "/assets/air_puri.jpg";
                    break;
                  case "Water Purifier":
                    localImage = "/assets/water_purifier.jpeg";
                    break;
                  case "Geyser":
                    localImage = "/assets/geyser.jpg";
                    break;
                  case "Microwave":
                    localImage = "/assets/microwave.jpeg";
                    break;
                  case "Refrigerator":
                    localImage = "/assets/refrigwrator.jpeg";
                    break;
                  case "Washing Machine":
                    localImage = "/assets/washing_machine.jpeg";
                    break;
                  case "Deep Freezer":
                    localImage = "/assets/deep_freeze.png";
                    break;
                  case "Visi Cooler":
                    localImage = "/assets/Visi _Coole.png";
                    break;
                  case "Cassette AC":
                    localImage = "/assets/cas.webp";
                    break;
                  case "Water Cooler cum Purifier":
                    localImage = "/assets/water_cooler.jpeg";
                    break;
                  case "Water Dispenser":
                    localImage = "/assets/Water-dis.jpg";
                    break;
                  case "Display Counter":
                    localImage = "/assets/display-counter.png";
                    break;
                  case "Water Cooler":
                    localImage = "/assets/wcooler.jpeg";
                    break;
                  case "Upright Chiller":
                    localImage = "/assets/uchiller.jpeg";
                    break;
                  case "Under Counter":
                    localImage = "/assets/ucounter.jpg";
                    break;
                  case "Back Bar Chiller":
                    localImage = "/assets/bbchiler.jpeg";
                    break;
                  case "Food Prep Chiller":
                    localImage = "/assets/fprep.jpeg";
                    break;
                  case "Ice Maker":
                    localImage = "/assets/icube.jpg";
                    break;
                  case "Water Heater": 
                    localImage = "/assets/water_heater.jpeg";
                    break;
                  default:
                    localImage = "/assets/default.jpeg"; // Default image
                }
                

                if (!uniqueCategories.some((item) => item.name === product.category)) {
                  uniqueCategories.push({
                    name: product.category,
                    mainCategory: product.mainCategory,
                    type: product.type.charAt(0).toUpperCase() + product.type.slice(1),
                    description: `Expert ${product.category.toLowerCase()} repair and maintenance services.`,
                    image: localImage,
                  });
                }
              });
              console.log('categories: ', uniqueCategories);
              setCategories1(uniqueCategories); // Update state with unique categories
            } else {
              console.error("Failed to retrieve products:", response.data.message);
            }
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        };
    
        fetchAndFormatData(); // Call the async function
      }, []); // Dependency array ensures this effect runs only once

    const fetchServices = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/services/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('services data: ', response.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchServices();
    }, []);

    const toggleMainCategory = (category) => {
        setMainCategoryFilter((prev) => (prev === category ? null : category));
        setTypeFilter([]);
    };

    const toggleType = (type) => {
        setTypeFilter((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const handleButtonClick = (category, type) => {
        if (type === "purchase") {
            const categorySlug = category.toLowerCase().replace(/ /g, "-");
            navigate(`/products/${categorySlug}?type=${type}`);
        } else if (type === "service") {
            setSelectedCategory(categories.find((cat) => cat.name === category));
            setIsServiceModalOpen(true);
        }
    };

    useEffect(() => {
        let updatedCategories = [...categories1];

        // if (mainCategoryFilter) {
        //     updatedCategories = updatedCategories.filter(
        //         (cat) => cat.mainCategory === mainCategoryFilter
        //     );
        // }

        if (mainCategoryFilter) {
            updatedCategories = updatedCategories.filter(
                (cat) => mainCategoryFilter.includes(cat.mainCategory)
            );
        }
        

        if (typeFilter.length > 0) {
            updatedCategories = updatedCategories.filter((cat) =>
                typeFilter.includes(cat.type)
            );
        }

        if (sortType === "name") {
            updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredCategories(updatedCategories);
    }, [mainCategoryFilter, typeFilter, sortType, categories, categories1]);

    return (
        <div className="container px-4 py-8 mx-auto">
            <header className="flex flex-col items-center justify-between pb-4 mb-8 border-b">
                <h1 className="mb-2 text-3xl font-bold">Welcome to Chill Mart</h1>
                <p className="text-gray-600">Find the best appliance solutions in one place</p>
                {/* <div className="mt-4">
                    <label className="text-gray-700">Sort by: </label>
                    <select
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                        className="p-2 ml-2 border border-gray-300 rounded"
                    >
                        <option value="name">Relevance</option>
                    </select>
                </div> */}
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
                                    checked={mainCategoryFilter === "Domestic Appliance"}
                                    onChange={() => toggleMainCategory("Domestic Appliance")}
                                />{" "}
                                Domestic Appliance
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="mainCategory"
                                    checked={mainCategoryFilter === "Retail Appliance"}
                                    onChange={() => toggleMainCategory("Retail Appliance")}
                                />{" "}
                                Retail Appliance
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="mainCategory"
                                    checked={mainCategoryFilter === "Kitchen Appliance"}
                                    onChange={() => toggleMainCategory("Kitchen Appliance")}
                                />{" "}
                                Kitchen Appliance
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
                                        />{" "}
                                        {type}
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
                                <div
                                    key={index}
                                    className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg"
                                >
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="object-cover w-full h-48 mb-4 rounded-md"
                                    />
                                    <h3 className="text-lg font-semibold">{category.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {category.description}
                                    </p>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() =>
                                                handleButtonClick(category.name, "purchase")
                                            }
                                            className="flex-1 px-4 py-2 text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white"
                                        >
                                            Purchase
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleButtonClick(category.name, "service")
                                            }
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

            <ServiceModal
                isOpen={isServiceModalOpen}
                onClose={() => setIsServiceModalOpen(false)}
                category={selectedCategory}
            />
        </div>
    );
};

export default ServiceCollection;