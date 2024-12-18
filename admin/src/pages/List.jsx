import { useEffect, useState } from "react";
import axios from "axios";

const ListProducts = ({ token }) => {
  const [products, setProducts] = useState([]); // State to store products
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected Category
  const [selectedBrand, setSelectedBrand] = useState(""); // Selected Brand

  // Fetch Products from Backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/product/list", {
        headers: { token },
      });
      setProducts(response.data.data);
      setFilteredProducts(response.data.data); // Initialize filtered products
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a Product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/product/remove/${id}`, {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      const updatedProducts = products.filter((product) => product._id !== id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete the product.");
    }
  };

  // Search and Filter Logic
  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory);
    }

    if (selectedBrand) {
      result = result.filter((product) => product.brand === selectedBrand);
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, selectedBrand, products]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>

      {/* Filters and Search */}
      <div className="flex flex-wrap mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">All Categories</option>
          <option value="Air Conditioner">Air Conditioner</option>
          <option value="Microwave">Microwave</option>
          <option value="Refrigerator">Refrigerator</option>
          <option value="Water Heater">Water Heater</option>
          <option value="Geyser">Geyser</option>
        </select>

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">All Brands</option>
          <option value="Whirlpool">Whirlpool</option>
          <option value="Daikin">Daikin</option>
          <option value="LG">LG</option>
          <option value="Samsung">Samsung</option>
          <option value="Hitachi">Hitachi</option>
        </select>
      </div>

      {/* Product Table */}
      {loading ? (
        <p className="text-gray-700">Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-700">No products available.</p>
      ) : (
        <div className="overflow-x-auto bg-white p-6 rounded shadow-md">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Brand</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Rating</th>
                <th className="p-2 border">Availability</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-100">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">{product.brand}</td>
                  <td className="p-2 border">{product.category}</td>
                  <td className="p-2 border">₹{product.price}</td>
                  <td className="p-2 border text-center">{product.rating}</td>
                  <td className="p-2 border text-center">
                    {product.availability ? "Available" : "Out of Stock"}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListProducts;
