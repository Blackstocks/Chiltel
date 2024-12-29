import React, { useState } from "react";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AddProductForm from "@/components/AddProductForm";
import { toast } from "react-toastify";
import { products as initialProducts } from "@/data/products";

const SellerProducts = () => {
  // Local state for products
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteDialogProduct, setDeleteDialogProduct] = useState(null);
  const [requestApprovalProduct, setRequestApprovalProduct] = useState(null);
  const [approvalRequest, setApprovalRequest] = useState({
    notes: "",
    attachments: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    mainCategory: "all",
    type: "all",
    status: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  

  const mainCategories = ["all", "Retail", "Domestic Appliance", "Kitchen"];
  const types = [
    "all",
    "water",
    "cooling",
    "heating",
    "cooking",
    "cleaning",
    "display",
  ];
  const statusOptions = ["all", "pending", "approved", "rejected"];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleAddProduct = (productData) => {
    const newProduct = {
      ...productData,
      _id: Date.now().toString(),
      approvalStatus: "pending",
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [...prev, newProduct]);
    toast.success("Product added successfully");
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (productData) => {
    setProducts((prev) =>
      prev.map((product) =>
        product._id === editingProduct._id
          ? { ...product, ...productData, approvalStatus: "pending" }
          : product
      )
    );
    toast.success("Product updated successfully");
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = () => {
    setProducts((prev) =>
      prev.filter((product) => product._id !== deleteDialogProduct._id)
    );
    toast.success("Product deleted successfully");
    setDeleteDialogProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filters.mainCategory === "all" ||
      product.mainCategory === filters.mainCategory;

    const matchesType = filters.type === "all" || product.type === filters.type;

    const matchesStatus =
      filters.status === "all" || product.approvalStatus === filters.status;

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination
  
  <div className="flex items-center justify-between px-2 py-4">
    <div className="flex items-center gap-2">
      <p className="text-sm text-gray-500">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
        {filteredProducts.length} products
      </p>
      <Select
        value={String(itemsPerPage)}
        onValueChange={handleItemsPerPageChange}
      >
        <SelectTrigger className="w-[70px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[5, 10, 20, 50].map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm text-gray-500">per page</span>
    </div>

    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        First
      </Button>
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
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNumber = i + 1;

          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
          ) {
            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNumber)}
                className="w-8"
              >
                {pageNumber}
              </Button>
            );
          }

          if (
            pageNumber === currentPage - 3 ||
            pageNumber === currentPage + 3
          ) {
            return (
              <span key={pageNumber} className="px-1">
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
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last
      </Button>

      {/* Page Jump */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Go to:</span>
        <Input
          type="number"
          min={1}
          max={totalPages}
          className="w-16 h-8"
          value={currentPage}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            handlePageChange(value);
          }}
        />
      </div>
    </div>
  </div>

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products Management</CardTitle>
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
                <Button>
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
            value={filters.mainCategory}
            onValueChange={(value) =>
              setFilters({ ...filters, mainCategory: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {mainCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "All Types" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category/Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">
                              {product.brand} - {product.model}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {product.mainCategory}
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
                            {(product.price * (1 - product.discount)).toFixed(
                              2
                            )}
                          </div>
                          {product.discount > 0 && (
                            <div className="text-sm text-green-600">
                              -{(product.discount * 100).toFixed()}% off
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.inStock > 0 ? "success" : "destructive"
                          }
                        >
                          {product.inStock} in stock
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.approvalStatus === "approved"
                              ? "success"
                              : product.approvalStatus === "pending"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {product.approvalStatus.charAt(0).toUpperCase() +
                            product.approvalStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteDialogProduct(product)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          {(product.approvalStatus === "pending" ||
                            product.approvalStatus === "rejected") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-500"
                              onClick={() => setRequestApprovalProduct(product)}
                            >
                              Request Approval
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-2 py-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredProducts.length
                    )}{" "}
                    of {filteredProducts.length} products
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <AddProductForm
              onSubmit={handleEditProduct}
              onClose={() => {
                setIsEditDialogOpen(false);
                setEditingProduct(null);
              }}
              initialData={editingProduct}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteDialogProduct}
        onOpenChange={() => setDeleteDialogProduct(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product "{deleteDialogProduct?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogProduct(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Request Approval Dialog */}
      <Dialog
        open={!!requestApprovalProduct}
        onOpenChange={() => setRequestApprovalProduct(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Product Approval</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {requestApprovalProduct?.approvalStatus === "rejected" && (
              <div className="bg-red-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-red-800">
                  Previous Rejection Reason:
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  {requestApprovalProduct?.rejectionReason ||
                    "No reason provided"}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes for Admin</Label>
              <Textarea
                id="notes"
                placeholder="Explain why this product should be approved..."
                value={approvalRequest.notes}
                onChange={(e) =>
                  setApprovalRequest((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                className="h-32"
              />
            </div>

            <div className="space-y-2">
              <Label>Supporting Documents (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Enter document URL"
                  value={approvalRequest.newAttachment || ""}
                  onChange={(e) =>
                    setApprovalRequest((prev) => ({
                      ...prev,
                      newAttachment: e.target.value,
                    }))
                  }
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (approvalRequest.newAttachment) {
                      setApprovalRequest((prev) => ({
                        ...prev,
                        attachments: [...prev.attachments, prev.newAttachment],
                        newAttachment: "",
                      }));
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {approvalRequest.attachments.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm truncate">{url}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setApprovalRequest((prev) => ({
                          ...prev,
                          attachments: prev.attachments.filter(
                            (_, i) => i !== index
                          ),
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setRequestApprovalProduct(null);
                  setApprovalRequest({ notes: "", attachments: [] });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // In a real application, this would send the request to admin
                  const updatedProduct = {
                    ...requestApprovalProduct,
                    approvalRequest: {
                      status: "pending",
                      notes: approvalRequest.notes,
                      attachments: approvalRequest.attachments,
                      submittedAt: new Date().toISOString(),
                    },
                  };

                  setProducts((prev) =>
                    prev.map((product) =>
                      product._id === updatedProduct._id
                        ? updatedProduct
                        : product
                    )
                  );

                  toast.success("Approval request sent successfully");
                  setRequestApprovalProduct(null);
                  setApprovalRequest({ notes: "", attachments: [] });
                }}
                disabled={!approvalRequest.notes.trim()}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerProducts;
