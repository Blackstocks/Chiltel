import React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Edit, Trash2, Plus, FilterX } from "lucide-react";
import AddProductForm from "@/components/AddProductForm";
import { toast } from "react-toastify";
import ProductExport from "@/components/ProductExportButton";

const ITEMS_PER_PAGE = 5;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter and Sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(
        (product) => product.requestedStatus === statusFilter
      );
    }

    // Sort products
    result.sort((a, b) => {
      if (sortBy === "price") {
        const priceA = a.price * (1 - a.discount);
        const priceB = b.price * (1 - b.discount);
        return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
      }
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      // Default sort by createdAt
      return sortOrder === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    });

    return result;
  }, [products, searchTerm, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE));
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filteredAndSortedProducts.length]);

  // Update paginated data calculation
  const currentProducts = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredAndSortedProducts, currentPage]);

  // Reset filters function
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Updated fetch function with toast notifications

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/getSellerProducts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to fetch products");
        return;
      }

      if (!Array.isArray(data.data.products)) {
        toast.error("Invalid products data received");
        return;
      }

      setProducts(data.data.products);
      setTotalPages(Math.ceil(data.data.products.length / ITEMS_PER_PAGE));
    } catch (err) {
      toast.error("Error fetching products");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Updated delete function with toast notifications
  const handleDelete = async (productId) => {
    const confirmDelete = () => {
      return new Promise((resolve) => {
        toast.info(
          ({ closeToast }) => (
            <div>
              <p>Are you sure you want to delete this product?</p>
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    closeToast();
                    resolve(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    closeToast();
                    resolve(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ),
          { autoClose: false }
        );
      });
    };

    const confirmed = await confirmDelete();
    if (!confirmed) return;

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/seller/deleteSellerProduct/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to delete product");
        return;
      }

      setProducts(products.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Error deleting product");
      console.error("Delete error:", err);
    }
  };

  // Updated add product handler
  const handleAddProduct = async (newProduct) => {
    try {
      await fetchProducts();
      setIsAddDialogOpen(false);
      toast.success("Product added successfully");
    } catch (error) {
      toast.error("Failed to add product");
      console.error("Add product error:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 w-full">
            <div className="w-full sm:w-auto">
              <CardTitle className="text-xl sm:text-2xl">My Products</CardTitle>
              <CardDescription className="mt-1 text-sm sm:text-base">
                Manage and track your product listings
              </CardDescription>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto flex items-center justify-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
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
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <ProductExport data={filteredAndSortedProducts} />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Added</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="w-full sm:w-auto gap-2"
                >
                  <FilterX className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Products Table */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Main Category</TableHead>
                      <TableHead>Brand/Model</TableHead>
                      <TableHead>Category/Type</TableHead>
                      <TableHead>price</TableHead>
                      <TableHead>InStock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProducts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center h-32 text-gray-500"
                        >
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentProducts.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="h-12 w-12 rounded-md object-cover"
                              />
                              <div>
                                <div className="font-medium">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.mainCategory}</TableCell>
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
                              <div className="font-medium">
                                {product.category}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.type}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                ₹
                                {(
                                  product.price *
                                  (1 - product.discount)
                                ).toFixed(2)}
                              </div>
                              {product.discount > 0 && (
                                <div className="text-sm text-green-600">
                                  -{(product.discount * 100).toFixed(2)}% off
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                product.inStock === 0
                                  ? "text-red-600"
                                  : "font-medium"
                              }
                            >
                              {product.inStock}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={statusColors[product.requestedStatus]}
                            >
                              {product.requestedStatus.charAt(0).toUpperCase() +
                                product.requestedStatus.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  (window.location.href = `/seller/products/edit/${product._id}`)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDelete(product._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-4">
                <Pagination>
                  <PaginationContent className="flex flex-wrap justify-center gap-1 md:gap-0">
                    {/* Previous Button */}
                    <PaginationItem>
                      <PaginationPrevious
                        className={`${
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        } hidden sm:flex`}
                        onClick={() =>
                          currentPage > 1 && handlePageChange(currentPage - 1)
                        }
                      />
                      {/* Mobile Previous Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        className={`${
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        } sm:hidden h-9 w-9`}
                        onClick={() =>
                          currentPage > 1 && handlePageChange(currentPage - 1)
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </PaginationItem>

                    {/* Generate page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // On mobile, show fewer pages
                        if (window.innerWidth < 640) {
                          if (page === 1) return true;
                          if (page === totalPages) return true;
                          if (page === currentPage) return true;
                          return false;
                        }

                        // On desktop, show more pages
                        if (page === 1) return true;
                        if (page === totalPages) return true;
                        if (Math.abs(currentPage - page) <= 1) return true;
                        return false;
                      })
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {/* Add ellipsis if there's a gap */}
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <PaginationItem>
                              <PaginationEllipsis className="hidden sm:inline-flex" />
                              <PaginationEllipsis className="sm:hidden w-6" />
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="h-9 w-9 sm:h-10 sm:w-10 p-0"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      ))}

                    {/* Next Button */}
                    <PaginationItem>
                      <PaginationNext
                        className={`${
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        } hidden sm:flex`}
                        onClick={() =>
                          currentPage < totalPages &&
                          handlePageChange(currentPage + 1)
                        }
                      />
                      {/* Mobile Next Button */}
                      <Button
                        variant="outline"
                        size="icon"
                        className={`${
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        } sm:hidden h-9 w-9`}
                        onClick={() =>
                          currentPage < totalPages &&
                          handlePageChange(currentPage + 1)
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
