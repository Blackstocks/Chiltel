import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, FileDown, Printer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import AddProductForm from "@/components/AddProductForm";
import axios from "axios";
import { toast } from "react-toastify";
import PendingProductsTable from "@/components/PendingProductsTable";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";
import ProductDetailDialog from "@/components/ProductDetailDialog";

const ProductsPage = () => {
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
  const [isPendingProductsDialogOpen, setiIsPendingProductsDialogOpen] =
    useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    availability: "all",
    priceRange: "all",
  });

  const [products, setProducts] = useState([]);

  // Add new state for product details sheet
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

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
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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

  const handleAddProduct = async (newProduct) => {
    await fetchProducts();
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

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/remove/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts(products.filter((product) => product.id !== id));
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  // Update filtered products with pagination
  const filteredProducts = products?.filter((product) => {
    if (
      !product?.name ||
      !product?.category ||
      !product?.brand ||
      !product?.model
    )
      return false;
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

  // Calculate total pages based on filtered results
  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filteredProducts.length, itemsPerPage]);

  // Add this utility function outside the component
  const exportToCSV = (products, fileType) => {
    // Define the fields to include in the CSV
    const fields = [
      "name",
      "mainCategory",
      "brand",
      "model",
      "category",
      "type",
      "price",
      "discount",
      "rating",
      "reviews",
      "inStock",
      "availability",
    ];

    // Create CSV header
    const header = fields.join(",") + "\n";

    // Create CSV rows
    const rows = products
      .map((product) => {
        return fields
          .map((field) => {
            let value = product[field];

            // Handle special cases
            if (field === "price") {
              value = (product.price * (1 - product.discount)).toFixed(2);
            } else if (field === "availability") {
              value = product.availability ? "In Stock" : "Out of Stock";
            } else if (typeof value === "string" && value.includes(",")) {
              // Escape strings containing commas
              value = `"${value}"`;
            }

            return value;
          })
          .join(",");
      })
      .join("\n");

    // Combine header and rows
    const csv = header + rows;

    // Create blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `products_export_${new Date().toISOString().split("T")[0]}.${fileType}`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add this utility function for printing
  const printProducts = (products) => {
    // Create a printable version of the data
    const printContent = products
      .map(
        (product) => `
    Name: ${product.name}
    Category: ${product.mainCategory}
    Brand/Model: ${product.brand} / ${product.model}
    Price: ₹${(product.price * (1 - product.discount)).toFixed(2)}
    Status: ${product.availability ? "In Stock" : "Out of Stock"}
    Rating: ${product.rating} (${product.reviews} reviews)
    ----------------------------------------
  `
      )
      .join("\n");

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <html>
      <head>
        <title>Products List</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          pre { white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h1>Products List</h1>
        <pre>${printContent}</pre>
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">
            Products Management
          </CardTitle>
          <div className="flex space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <FileDown className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => exportToCSV(products, "csv")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => printProducts(products)}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <Dialog
              open={isPendingProductsDialogOpen}
              onOpenChange={setiIsPendingProductsDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="relative">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Pending Products
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-[80vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Pending Products</DialogTitle>
                </DialogHeader>
                <PendingProductsTable
                  onClose={() => isPendingProductsDialogOpen(false)}
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
                <TableHead>Name/Main Category</TableHead>
                <TableHead>Brand/Model</TableHead>
                <TableHead>Category/Type</TableHead>
                <TableHead>price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>InStock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        {product.mainCategory}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.brand}</div>
                      <div className="text-sm text-gray-500">
                        {product.model}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.category}</div>
                      <div className="text-sm text-gray-500">
                        {product.type}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        ₹{(product.price * (1 - product.discount)).toFixed(2)}
                      </div>
                      {product.discount > 0 && (
                        <div className="text-sm text-green-600">
                          -{(product.discount * 100).toFixed(2)}% off
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{product.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({product.reviews})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.inStock}
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
                        onClick={() => handleViewDetails(product)}
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
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
                        onClick={() => handleDeleteProduct(product._id)}
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)}{" "}
                of {filteredProducts.length} items
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
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          currentPage === pageNumber ? "default" : "outline"
                        }
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

      {/* Add Product Details Sheet */}
      <ProductDetailDialog
        product={selectedProduct}
        open={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedProduct(null);
        }}
      />

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
