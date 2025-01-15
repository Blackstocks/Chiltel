import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileDown, Download, Printer, FileSpreadsheet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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

// Add these utility functions outside your component
const exportToCSV = async (products, exportType = "filtered") => {
  try {
    // Define fields to export
    const fields = [
      { key: "name", label: "Product Name" },
      { key: "mainCategory", label: "Main Category" },
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "category", label: "Category" },
      { key: "type", label: "Type" },
      { key: "price", label: "Price" },
      { key: "discount", label: "Discount" },
      { key: "inStock", label: "Stock" },
      { key: "requestedStatus", label: "Status" },
    ];

    // Create CSV header
    const header = fields.map((field) => field.label).join(",") + "\n";

    // Create CSV rows
    const rows = products
      .map((product) => {
        return fields
          .map((field) => {
            let value = product[field.key];

            // Handle special cases
            if (field.key === "price") {
              value = (product.price * (1 - product.discount)).toFixed(2);
            } else if (field.key === "discount") {
              value = `${(product.discount * 100).toFixed(2)}%`;
            } else if (field.key === "requestedStatus") {
              value = value.charAt(0).toUpperCase() + value.slice(1);
            }

            // Handle values containing commas
            if (typeof value === "string" && value.includes(",")) {
              value = `"${value}"`;
            }

            return value;
          })
          .join(",");
      })
      .join("\n");

    // Combine header and rows
    const csv = header + rows;

    // Create and download file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `products_${exportType}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    throw error;
  }
};



// Updated printProducts function with loading indicator
const printProducts = async (products, printAll = false) => {
  try {
    let productsToprint = products;

    if (printAll) {
      // Show loading indicator in print window
      const loadingWindow = window.open("", "_blank");
      loadingWindow.document.write(`
        <html>
          <head>
            <title>Loading Products...</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
              .loader { 
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 20px auto;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <h2>Loading all products...</h2>
            <div class="loader"></div>
            <p>Please wait while we prepare your document...</p>
          </body>
        </html>
      `);

      // Fetch all products
      productsToprint = await fetchAllProducts();
      loadingWindow.close();
    }

    const printWindow = window.open("", "_blank");
    const content = `
      <html>
        <head>
          <title>Products List</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              max-width: 1200px; 
              margin: 0 auto; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              page-break-inside: auto;
            }
            tr { 
              page-break-inside: avoid; 
              page-break-after: auto;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
            }
            th { 
              background-color: #f5f5f5; 
              font-weight: bold;
            }
            .status { 
              padding: 4px 8px; 
              border-radius: 4px; 
              display: inline-block;
            }
            .status-pending { background-color: #fff7ed; color: #9a3412; }
            .status-approved { background-color: #f0fdf4; color: #166534; }
            .status-rejected { background-color: #fef2f2; color: #991b1b; }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: center;
              margin-bottom: 20px;
              padding-bottom: 20px;
              border-bottom: 2px solid #eee;
            }
            .product-image {
              width: 50px;
              height: 50px;
              object-fit: cover;
              border-radius: 4px;
            }
            .price-cell {
              white-space: nowrap;
            }
            .discount {
              color: #16a34a;
              font-size: 0.875rem;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; }
              thead { display: table-header-group; }
              tfoot { display: table-footer-group; }
              button { display: none; }
              .no-break { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 style="margin: 0;">Products List</h1>
              <p style="color: #666; margin: 5px 0;">
                ${printAll ? "All Products" : "Current Page Products"} - 
                Generated on ${new Date().toLocaleString()}
              </p>
            </div>
            <div style="text-align: right;">
              <p>Total Products: ${productsToprint.length}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand/Model</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${productsToprint
                .map(
                  (product) => `
                <tr class="no-break">
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <img src="${product.thumbnail}" alt="${
                    product.name
                  }" class="product-image"/>
                      <span>${product.name}</span>
                    </div>
                  </td>
                  <td>${product.mainCategory}</td>
                  <td>
                    <div>${product.brand}</div>
                    <div style="color: #666; font-size: 0.875rem;">${
                      product.model
                    }</div>
                  </td>
                  <td class="price-cell">
                    ₹${(product.price * (1 - product.discount)).toFixed(2)}
                    ${
                      product.discount > 0
                        ? `<div class="discount">-${(
                            product.discount * 100
                          ).toFixed(2)}% off</div>`
                        : ""
                    }
                  </td>
                  <td>${product.inStock}</td>
                  <td>
                    <span class="status status-${product.requestedStatus.toLowerCase()}">
                      ${
                        product.requestedStatus.charAt(0).toUpperCase() +
                        product.requestedStatus.slice(1)
                      }
                    </span>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; margin: 20px;">
              Print Document
            </button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  } catch (error) {
    console.error("Error printing products:", error);
    alert("Failed to prepare print document. Please try again.");
  }
};



const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [mainCategory, setMainCategory] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  //const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, mainCategory, type, status, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit,
        ...(searchTerm && { search: searchTerm }),
        ...(mainCategory !== "all" && { mainCategory }),
        ...(type !== "all" && { type }),
        ...(status !== "all" && { requestedStatus: status }),
        ...(priceRange.min && { minPrice: priceRange.min }),
        ...(priceRange.max && { maxPrice: priceRange.max }),
        sortBy,
        sortOrder,
      });

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/seller/getSellerProducts?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.data.products);
      console.log(data.data.products);
      setTotalPages(data.data.pagination.totalPages);
      setFilters(data.data.filters);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

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

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddProduct = async (newProduct) => {
    await fetchProducts();
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setIsAddDialogOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setMainCategory("all");
    setType("all");
    setStatus("all");
    setPriceRange({ min: "", max: "" });
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>My Products</CardTitle>
              <CardDescription>
                Manage and track your product listings
              </CardDescription>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileDown className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              {/* Replace the existing DropdownMenuContent with this updated version */}
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => exportToCSV(products, "current_page")}
                  className="flex items-center"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Current Page
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      const allProducts = await fetchAllProducts();
                      await exportToCSV(allProducts, "all");
                    } catch (error) {
                      console.error("Export failed:", error);
                    }
                  }}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All Products
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => printProducts(products, false)}
                  className="flex items-center"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Current Page
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => printProducts(products, true)}
                  className="flex items-center"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print All Products
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={mainCategory} onValueChange={setMainCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Main Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {filters.mainCategories?.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {filters.types?.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Added</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={resetFilters}
                className="gap-2"
              >
                <FilterX className="h-4 w-4" />
                Reset Filters
              </Button>
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
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center h-32 text-gray-500"
                        >
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
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
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      const diff = Math.abs(page - currentPage);
                      return (
                        diff === 0 ||
                        diff === 1 ||
                        page === 1 ||
                        page === totalPages
                      );
                    })
                    .map((page, index, array) => {
                      if (index > 0 && array[index - 1] !== page - 1) {
                        return [
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>,
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>,
                        ];
                      }
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
