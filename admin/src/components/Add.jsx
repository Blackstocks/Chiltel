import { useState } from "react";

const AddProductForm = ({ onSubmit, onClose, token }) => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    model: "",
    category: "Air Conditioner",
    price: "",
    discount: 0,
    rating: 0,
    reviews: 0,
    features: [],
    specifications: {
      capacity: "",
      starRating: "",
      powerConsumption: "",
      cooling: "",
      ambientOperation: "",
      waterproofRating: "",
    },
    availability: true,
    imageUrls: [],
  });

  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setProduct({ ...product, availability: checked });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  // Handle Specifications
  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      specifications: { ...product.specifications, [name]: value },
    });
  };

  // Add Feature
  const addFeature = () => {
    if (featureInput) {
      setProduct({ ...product, features: [...product.features, featureInput] });
      setFeatureInput("");
    }
  };

  // Submit Product to Backend
  const handleAddProduct = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:4000/api/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Product added successfully!");
        onSubmit(product);
        setProduct({
          name: "",
          brand: "",
          model: "",
          category: "",
          price: "",
          discount: 0,
          rating: 0,
          reviews: 0,
          features: [],
          specifications: {
            capacity: "",
            starRating: "",
            powerConsumption: "",
            cooling: "",
            ambientOperation: "",
            waterproofRating: "",
          },
          availability: true,
          imageUrls: [],
        });
      } else {
        throw new Error(data.message || "Failed to add product");
      }
    } catch (error) {
      setMessage("Failed to add product. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add Product</h2>

      {/* Product Name */}
      <input
        type="text"
        placeholder="Product Name"
        name="name"
        value={product.name}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-4"
      />

      {/* Brand */}
      <input
        type="text"
        placeholder="Brand"
        name="brand"
        value={product.brand}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-4"
      />

      {/* Model */}
      <input
        type="text"
        placeholder="Model"
        name="model"
        value={product.model}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-4"
      />

      {/* Category */}
      <select
        name="category"
        value={product.category}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="Air Conditioner">Air Conditioner</option>
        <option value="Microwave">Microwave</option>
        <option value="Refrigerator">Refrigerator</option>
        <option value="Water Heater">Water Heater</option>
        <option value="Geyser">Geyser</option>
      </select>

      {/* price */}
      <input
        type="number"
        placeholder="price"
        name="price"
        value={product.price}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-4"
      />

      {/* Features */}
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Add Feature"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="button"
            onClick={addFeature}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
        <ul className="mt-2">
          {product.features.map((feature, index) => (
            <li key={index} className="text-sm text-gray-700">
              - {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Specifications */}
      <h3 className="font-semibold mb-2">Specifications</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Capacity"
          name="capacity"
          value={product.specifications.capacity}
          onChange={handleSpecChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Star Rating"
          name="starRating"
          value={product.specifications.starRating}
          onChange={handleSpecChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Power Consumption"
          name="powerConsumption"
          value={product.specifications.powerConsumption}
          onChange={handleSpecChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Cooling"
          name="cooling"
          value={product.specifications.cooling}
          onChange={handleSpecChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="AmbientOperation"
          name="ambientOperation"
          value={product.specifications.ambientOperation}
          onChange={handleSpecChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="WaterproofRating"
          name="waterproofRating"
          value={product.specifications.waterproofRating}
          onChange={handleSpecChange}
          className="border p-2 rounded"
        />
      </div>

      {/* Availability */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          name="availability"
          checked={product.availability}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="text-gray-700">Available</label>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`mb-4 p-2 rounded ${
            message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleAddProduct}
          disabled={loading}
          className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddProductForm;