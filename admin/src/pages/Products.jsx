import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

// Product Form Component
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

      {/* Price */}
      <input
        type="number"
        placeholder="Price"
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

// Main Products Page Component
// ... rest of the ProductsPage component remains the same ...

// Product List Component
/*const ProductList = () => {
  const products = [
    { id: 1, name: 'Deep Freezer XL', category: 'Deep Freezer', price: 24999, stock: 10 },
    { id: 2, name: 'Visi-Cooler Pro', category: 'Visi-Cooler', price: 18999, stock: 15 },
    { id: 3, name: 'AC Supreme', category: 'AC', price: 32999, stock: 8 },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4">{product.name}</td>
              <td className="px-6 py-4">{product.category}</td>
              <td className="px-6 py-4">₹{product.price}</td>
              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4 space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit size={18} />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};*/

// Main Products Page Component
/*const ProductsPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Plus size={20} />
                <span>Add Product</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <AddProductForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ProductList />
    </div>
  );
};

export default ProductsPage;*/

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    availability: "all",
    priceRange: "all",
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Deep Freezer XL",
      brand: "CoolTech",
      category: "Deep Freezer",
      price: 24999,
      availability: true,
      specifications: {
        capacity: "500L",
        starRating: "4",
      },
      features: ["Frost Free", "Digital Display"],
    },
    {
      id: 2,
      name: "Visi-Cooler Pro",
      brand: "FrostKing",
      category: "Visi-Cooler",
      price: 18999,
      availability: true,
      specifications: {
        capacity: "300L",
        starRating: "3",
      },
      features: ["LED Lighting", "Adjustable Shelves"],
    },
    {
      id: 3,
      name: "AC Supreme",
      brand: "ChillMaster",
      category: "AC",
      price: 32999,
      availability: false,
      specifications: {
        capacity: "1.5T",
        starRating: "5",
      },
      features: ["Inverter Technology", "Wi-Fi Enabled"],
    },
  ]);

  // Get unique categories from products
  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "Under ₹20,000", value: "0-20000" },
    { label: "₹20,000 - ₹30,000", value: "20000-30000" },
    { label: "Above ₹30,000", value: "30000+" },
  ];

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setIsAddDialogOpen(false);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Filter products based on all criteria
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filters.category === "all" || product.category === filters.category;

    const matchesAvailability =
      filters.availability === "all" ||
      (filters.availability === "inStock" && product.availability) ||
      (filters.availability === "outOfStock" && !product.availability);

    const matchesPriceRange = (() => {
      if (filters.priceRange === "all") return true;
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (filters.priceRange === "30000+") return product.price >= 30000;
      return product.price >= min && product.price <= max;
    })();

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAvailability &&
      matchesPriceRange
    );
  });

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">
            Products Management
          </CardTitle>
          <div className="flex space-x-4">
            <div className="flex items-center border rounded-md px-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search products..."
                className="border-0 focus:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <AddProductForm
                  onSubmit={handleAddProduct}
                  onClose={() => setIsAddDialogOpen(false)}
                  token="your-token-here"
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        {/* Filters Section */}
        <div className="px-6 py-4 border-b flex space-x-4">
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters({ ...filters, category: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.availability}
            onValueChange={(value) =>
              setFilters({ ...filters, availability: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="inStock">In Stock</SelectItem>
              <SelectItem value="outOfStock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priceRange}
            onValueChange={(value) =>
              setFilters({ ...filters, priceRange: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>₹{product.price.toLocaleString()}</TableCell>
                  <TableCell>{product.specifications.capacity}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.availability
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.availability ? "In Stock" : "Out of Stock"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <AddProductForm
              onSubmit={handleEditSave}
              onClose={() => setIsEditDialogOpen(false)}
              token="your-token-here"
              initialData={editingProduct}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
