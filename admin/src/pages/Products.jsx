import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
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
import { Pencil, Trash2, Star } from "lucide-react";
import AddProductForm from "@/components/AddProductForm";
import axios from "axios";

const ProductsPage = ({ token }) => {
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  // Pagination options
  const pageSizeOptions = [5, 10, 15, 20];

  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); 
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
      model: "DF-500X",
      category: "Deep Freezer",
      discountedprice: 24999,
      discount: 10,
      rating: 4.5,
      reviews: 128,
      availability: true,
      specifications: {
        capacity: "500L",
        starRating: "4",
        powerConsumption: "2.5 kW/day",
        cooling: "Direct Cooling",
        ambientOperation: "16°C to 43°C",
        waterproofRating: "IPX4"
      },
      features: ["Frost Free", "Digital Display"],
      imageUrls: ["/images/freezer-1.jpg", "/images/freezer-2.jpg"],
    },
    {
      id: 2,
      name: "Visi-Cooler Pro",
      brand: "FrostKing",
      model: "VC-300",
      category: "Visi-Cooler",
      discounteddiscountedPrice: 18999,
      discount: 5,
      rating: 4.2,
      reviews: 95,
      availability: true,
      specifications: {
        capacity: "300L",
        starRating: "3",
        powerConsumption: "1.8 kW/day",
        cooling: "Fan Cooling",
        ambientOperation: "18°C to 40°C",
        waterproofRating: "IPX3"
      },
      features: ["LED Lighting", "Adjustable Shelves"],
      imageUrls: ["/images/cooler-1.jpg"],
    },
    {
      id: 3,
      name: "AC Supreme",
      brand: "ChillMaster",
      model: "AC-15S",
      category: "AC",
      discountedprice: 32999,
      discount: 15,
      rating: 4.8,
      reviews: 256,
      availability: false,
      specifications: {
        capacity: "1.5T",
        starRating: "5",
        powerConsumption: "1.2 kW/h",
        cooling: "Inverter Cooling",
        ambientOperation: "16°C to 50°C",
        waterproofRating: "IPX5"
      },
      features: ["Inverter Technology", "Wi-Fi Enabled"],
      imageUrls: ["/images/ac-1.jpg", "/images/ac-2.jpg"],
    },
  ]);



  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const priceRanges = [
    { label: "All prices", value: "all" },
    { label: "Under ₹20,000", value: "0-20000" },
    { label: "₹20,000 - ₹30,000", value: "20000-30000" },
    { label: "Above ₹30,000", value: "30000+" },
  ];

  // Calculate pagination
  const paginateProducts = (products) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return products.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Fetch Products from Backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/product/list", {
        headers: { token },
      });
      setProducts(response.data.data);
      console.log(response.data.data);
      //setFilteredProducts(response.data.data); // Initialize filtered products
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


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

  // Update filtered products with pagination
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model.toLowerCase().includes(searchTerm.toLowerCase());

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

  // Calculate total pages based on filtered results
  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filteredProducts.length, itemsPerPage]);

  // Get paginated data
  const paginatedProducts = paginateProducts(filteredProducts);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Update useEffect for pagination
  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage]); // Re-fetch when page or items per page changes

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
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <AddProductForm
                  onSubmit={handleAddProduct}
                  onClose={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

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
              <SelectValue placeholder="price Range" />
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
                <TableHead>Brand/Model</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.brand}</div>
                      <div className="text-sm text-gray-500">{product.model}</div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">₹{product.discountedPrice}</div>
                      {product.discount > 0 && (
                        <div className="text-sm text-green-600">-{product.discount}% off</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{product.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                    </div>
                  </TableCell>
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
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Items per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
                {filteredProducts.length} items
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and one page before and after current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span key={pageNumber} className="px-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <AddProductForm
              onSubmit={handleEditSave}
              onClose={() => setIsEditDialogOpen(false)}
              initialData={editingProduct}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;