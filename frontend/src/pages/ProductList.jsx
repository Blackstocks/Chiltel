import React, { useState, useEffect, useMemo, useContext } from "react";
import axios from 'axios';
import { useParams, useSearchParams } from "react-router-dom";
import { Star, StarHalf, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { use } from "react";
import AuthContext from "../context/AuthContext";
import { toast } from 'react-toastify'
import { ShopContext } from "../context/ShopContext";
import CartContext from "../context/CartContext";

const ProductList = () => {
  const {user, isAuthenticated} = useContext(AuthContext);
  const { backendUrl } = useContext(ShopContext);
  const { addToCart } = useContext(CartContext);
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type");
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchProducts = async ()=>{
      try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`);
        setProductsData(response.data.data);
      }catch(err){
        console.error('Error while fetching products: ', err);
      }finally{
        setLoading(false);
      }
    }

    fetchProducts();
  },[])

    // Price range options
    const priceRanges = [
      { label: "Under ₹15,000", min: 0, max: 15000 },
      { label: "₹15,000 - ₹30,000", min: 15000, max: 30000 },
      { label: "₹30,000 - ₹50,000", min: 30000, max: 50000 },
      { label: "Above ₹50,000", min: 50000, max: Infinity },
    ];
  
    const data = type === "purchase" ? productsData : {};
    console.log('data: ', data);
    // const items = data.filter(prod=>prod.category==category) || [];
    const items = data.filter(prod => 
      prod.category.toLowerCase().replace(/[-\s]/g, '') === category.toLowerCase().replace(/[-\s]/g, '')
    ) || [];
    
    console.log('category: ', category);
    console.log('items: ', items);
  
    const [filteredItems, setFilteredItems] = useState(items);
    const [filters, setFilters] = useState({
      brand: [],
      priceRange: [],
      rating: null,
    });
  
    const handleBuyNow = (item) => {
      // Navigate to checkout with product details as state
      if(!isAuthenticated){
        toast.info('Please log in to proceed with your purchase.');
      }else{
        navigate("/checkout", {
          state: {
            product: {
              name: item.name,
              price: item.discountedPrice,
              image: item.image,
              specifications: item.specifications,
            },
          },
        });
      }
    };

    const handleAddToCart = async (item) => {
      addToCart(user, item);
      // const token = localStorage.getItem('token');

      // if(!isAuthenticated){
      //   toast.info('Please log in to add this item into your cart.');
      // }else{
      //   console.log('Item: ',item);
      //   toast.info('Item added to cart');
      //   try{
      //     const response = await axios.post(backendUrl + '/api/cart/add', {
      //       userId: user._id,
      //       itemId: item._id,
      //       price: item.discountedPrice,
      //       name: item.name,
      //       image: item.image,
      //       category: item.category
      //     }, {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     });
      //     console.log('Add to cart: ', response.data);
      //   }catch(err){
      //     console.error('Error while adding item to card: ', err);
      //   }
      //   console.log('user: ', user);
      // }
    }

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Rating Stars Component
  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex flex-wrap items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && (
          <StarHalf className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        )}
        <span className="ml-2 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  // Apply filters
  useEffect(() => {
    let result = items;

    if (filters.brand.length > 0) {
      result = result.filter((item) => filters.brand.includes(item.brand));
    }

    if (filters.priceRange.length > 0) {
      result = result.filter((item) => {
        return filters.priceRange.some(
          (range) =>
            parseInt(item.discountedPrice) >= range.min &&
            parseInt(item.discountedPrice) <= range.max
        );
      });
    }

    if (filters.rating) {
      result = result.filter((item) => item.rating >= filters.rating);
    }

    setFilteredItems(result);
  }, [filters, loading]);

  if(loading) return (<Loading />);

  return (
    <div className="w-full max-w-screen-xl px-2 py-8 mx-auto sm:px-4 md:px-4 lg:px-2 xl:px-2">
      <header className="mb-8">
        <h1 className="text-2xl font-bold capitalize md:text-3xl">
          {category.replace(/-/g, " ")}{" "}
          {type === "purchase" ? "Products" : "Services"}
        </h1>
        <p className="mt-2 text-gray-600">
          Showing {filteredItems.length} results
        </p>
      </header>

      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        {/* Filter Toggle Button for Mobile */}
        <div className="mb-4 md:hidden">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none"
          >
            {isFilterOpen ? (
              <X className="w-5 h-5 mr-2" />
            ) : (
              <Menu className="w-5 h-5 mr-2" />
            )}
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Filters Section */}
        <aside
          className={`${
            isFilterOpen ? "block" : "hidden"
          } md:block md:col-span-3`}
        >
          <div className="sticky top-4">
            <div className="p-4 bg-white border rounded-lg">
              <h2 className="mb-4 text-lg font-semibold">Filters</h2>

              {type === "purchase" && (
                <>
                  {/* Brand Filter */}
                  <div className="mb-4">
                    <h3 className="mb-2 font-medium">Brand</h3>
                    <div className="space-y-2 overflow-y-auto max-h-40">
                      {Array.from(new Set(items.map((item) => item.brand))).map(
                        (brand) => (
                          <label key={brand} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.brand.includes(brand)}
                              onChange={(e) => {
                                setFilters((prev) => ({
                                  ...prev,
                                  brand: e.target.checked
                                    ? [...prev.brand, brand]
                                    : prev.brand.filter((b) => b !== brand),
                                }));
                              }}
                              className="mr-2"
                            />
                            <span>{brand}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-4">
                    <h3 className="mb-2 font-medium">Price Range</h3>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label key={range.label} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.priceRange.some(
                              (r) => r.label === range.label
                            )}
                            onChange={(e) => {
                              setFilters((prev) => ({
                                ...prev,
                                priceRange: e.target.checked
                                  ? [...prev.priceRange, range]
                                  : prev.priceRange.filter(
                                      (r) => r.label !== range.label
                                    ),
                              }));
                            }}
                            className="mr-2"
                          />
                          <span>{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Rating Filter */}
              <div className="mb-4">
                <h3 className="mb-2 font-medium">Rating</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === 4}
                      onChange={() =>
                        setFilters((prev) => ({ ...prev, rating: 4 }))
                      }
                      className="mr-2"
                    />
                    <span>4★ & above</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === 3}
                      onChange={() =>
                        setFilters((prev) => ({ ...prev, rating: 3 }))
                      }
                      className="mr-2"
                    />
                    <span>3★ & above</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === null}
                      onChange={() =>
                        setFilters((prev) => ({ ...prev, rating: null }))
                      }
                      className="mr-2"
                    />
                    <span>All Ratings</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-4">
                <button
                  onClick={() =>
                    setFilters({
                      brand: [],
                      priceRange: [],
                      rating: null,
                    })
                  }
                  className="w-full px-4 py-2 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="md:col-span-9">
          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-600">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md"
                >
                  {/* Image Section */}
                  <div className="flex items-center justify-center p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-contain w-full h-48 rounded"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col flex-1 p-4">
                    {/* Title and Rating */}
                    <div className="mb-2">
                      <h2 className="text-lg font-medium break-words">
                        {item.name}
                      </h2>
                      <div className="flex items-center mt-1 space-x-2">
                        <RatingStars rating={item.rating} />
                        <span className="text-sm text-gray-600">
                          ({item.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="mb-2">
                      <span className="text-xl font-bold">
                        ₹{parseInt(item.discountedPrice).toLocaleString()}
                      </span>
                      {parseInt(item.originalPrice) >
                        parseInt(item.discountedPrice) && (
                        <>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₹{parseInt(item.originalPrice).toLocaleString()}
                          </span>
                          <span className="ml-2 text-sm font-medium text-green-600">
                            {Math.round(
                              ((parseInt(item.originalPrice) -
                                parseInt(item.discountedPrice)) /
                                parseInt(item.originalPrice)) *
                                100
                            )}
                            % off
                          </span>
                        </>
                      )}
                    </div>

                    {/* Specifications */}
                    <div className="mb-2">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(item.specifications).map(
                          ([key, value], index) => (
                            <div key={index}>
                              <span className="text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </span>
                              <span className="ml-1 font-medium break-words">
                                {value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-2">
                      <h3 className="text-sm font-medium">Features:</h3>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {item.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mt-auto sm:flex-row">
                      <button onClick={() => handleAddToCart(item)} className="flex-1 px-4 py-2 text-center text-black transition-colors bg-white border border-black rounded-md hover:bg-black hover:text-white">
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleBuyNow(item)}
                        className="flex-1 px-4 py-2 text-center text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Buy Now
                      </button>
                    </div>
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

export default ProductList;
