import { useEffect, useState } from "react";
import axios from "axios";

const ListProducts = ({token}) => {
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch Products from Backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/product/list", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }); // Replace with your backend API endpoint
      setProducts(response.data);
      console.log(products)
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>

      {loading ? (
        <p className="text-gray-700">Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
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
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">{product.brand}</td>
                  <td className="p-2 border">{product.category}</td>
                  <td className="p-2 border">₹{product.price}</td>
                  <td className="p-2 border text-center">{product.rating}</td>
                  <td className="p-2 border text-center">
                    {product.availability ? "Available" : "Out of Stock"}
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
