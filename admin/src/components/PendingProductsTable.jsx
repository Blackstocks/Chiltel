import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Loader2,
  Info,
  Building2,
  Store,
  Phone,
  FileCheck,
  Receipt,
  MapPin,
  DollarSign,
  Package,
  Settings,
  ImageIcon,
  Star,
  Check,
  ListChecks,
  FolderTree,
} from "lucide-react";
import { toast } from "react-toastify";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const PendingProductsTable = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [isSellerDetailOpen, setIsSellerDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [action, setAction] = useState(null);

  // Fetch pending products
  useEffect(() => {
    const fetchPendingProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/getPendingProducts`,
          { headers: { token } }
        );
        setProducts(response.data.data);
        console.log("Pending Products:", response.data.data);
      } catch (error) {
        toast.error("Failed to fetch pending products");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingProducts();
  }, [token]);

  const handleAction = (product, actionType) => {
    setSelectedProduct(product);
    setAction(actionType);
    setIsActionDialogOpen(true);
  };

  const confirmAction = async () => {
    try {
      const endpoint = action === "approved" ? "approve" : "reject";
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/${endpoint}/${
          selectedProduct._id
        }`,
        {},
        { headers: { token } }
      );

      setProducts(products.filter((p) => p._id !== selectedProduct._id));
      toast.success(`Product ${action} successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} product`);
      console.error("Error:", error);
    } finally {
      setIsActionDialogOpen(false);
    }
  };

  const renderSpecificationValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return (
        <div className="grid grid-cols-1 gap-2 pl-4 mt-2">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey}>
              <label className="text-gray-500 capitalize">{subKey}</label>
              <div className="font-medium">
                {renderSpecificationValue(subValue)}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return value.toString();
  };

  const ProductDetailDialog = ({ product, open, onClose }) => {
    if (!product) return null;

    // Calculate discounted price
    const discountedPrice = product.price - product.price * product.discount;
    console.log("Product specifications:", product.specifications);

    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader className="mb-4">
            <SheetTitle>Product Details</SheetTitle>
            <SheetDescription>
              Complete information about the product
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-100px)] pr-4">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-500">Product Name</label>
                    <p className="font-medium">{product.name}</p>
                  </div>
                  <div>
                    <label className="text-gray-500">Brand</label>
                    <p className="font-medium">{product.brand}</p>
                  </div>
                  <div>
                    <label className="text-gray-500">Model</label>
                    <p className="font-medium">{product.model}</p>
                  </div>
                  <div>
                    <label className="text-gray-500">Type</label>
                    <p className="font-medium capitalize">{product.type}</p>
                  </div>
                </div>
              </div>
              <Separator />
              {/* Category Information */}
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <FolderTree className="h-4 w-4" />
                  Category Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-500">Main Category</label>
                    <p className="font-medium">{product.mainCategory}</p>
                  </div>
                  <div>
                    <label className="text-gray-500">Category</label>
                    <p className="font-medium">{product.category}</p>
                  </div>
                </div>
              </div>
              <Separator />
              {/* Pricing & Stock */}
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <DollarSign className="h-4 w-4" />
                  Pricing & Stock Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-500">Original Price</label>
                    <p className="font-medium">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">Discount</label>
                    <p className="font-medium">{product.discount * 100}%</p>
                  </div>
                  <div>
                    <label className="text-gray-500">Final Price</label>
                    <p className="font-medium text-green-600">
                      ₹{discountedPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">Stock Available</label>
                    <p className="font-medium">{product.inStock} units</p>
                  </div>
                  <div>
                    <label className="text-gray-500">Availability</label>
                    <p
                      className={`font-medium ${
                        product.availability ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.availability ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
              {/* Features */}
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <ListChecks className="h-4 w-4" />
                  Key Features
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                      <Settings className="h-4 w-4" />
                      Technical Specifications
                    </h3>
                    <div className="space-y-4 text-sm">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div key={key}>
                            <label className="text-gray-500 font-medium capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </label>
                            <div
                              className={`${
                                typeof value === "object" ? "" : "font-medium"
                              }`}
                            >
                              {renderSpecificationValue(value)}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Images */}
              {product.imageUrls && product.imageUrls.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                      <ImageIcon className="h-4 w-4" />
                      Product Images
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {product.imageUrls.map((url, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden border"
                        >
                          <img
                            src={url}
                            alt={`Product image ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {/* Additional Info */}
              <Separator />
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Info className="h-4 w-4" />
                  Additional Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-500">Rating</label>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{product.rating}/5</span>
                      <span className="text-gray-500 ml-1">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500">Listed On</label>
                    <p className="font-medium">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  };

  const SellerDetailDialog = ({ seller, open, onClose }) => {
    if (!seller) return null;

    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader className="mb-4">
            <SheetTitle>Seller Details</SheetTitle>
            <SheetDescription>
              Complete information about the seller
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-100px)] pr-4">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Store className="h-4 w-4" />
                  Store Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-500">Shop Name</label>
                    <p className="font-medium">{seller.shopName}</p>
                  </div>
                  <div>
                    <label className="text-gray-500">Proprietor Name</label>
                    <p className="font-medium">{seller.proprietorName}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Phone className="h-4 w-4" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-500">Email</label>
                    <p className="font-medium">{seller.email}</p>
                  </div>
                  <div>
                    <label className="text-gray-500">Phone Number</label>
                    <p className="font-medium">{seller.phoneNumber}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Registered Address */}
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4" />
                  Registered Address
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">
                    {seller.registeredAddress.street}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-gray-500">City</label>
                      <p className="font-medium">
                        {seller.registeredAddress.city}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-500">State</label>
                      <p className="font-medium">
                        {seller.registeredAddress.state}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-500">Pincode</label>
                      <p className="font-medium">
                        {seller.registeredAddress.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warehouse Address */}
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4" />
                  Warehouse Address
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">
                    {seller.warehouseAddress.street}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-gray-500">City</label>
                      <p className="font-medium">
                        {seller.warehouseAddress.city}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-500">State</label>
                      <p className="font-medium">
                        {seller.warehouseAddress.state}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-500">Pincode</label>
                      <p className="font-medium">
                        {seller.warehouseAddress.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank & GST Details */}
              {(seller.bankDetails || seller.gstNumber) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                      <Receipt className="h-4 w-4" />
                      Bank & Tax Details
                    </h3>
                    <div className="space-y-4 text-sm">
                      {seller.gstNumber && (
                        <div>
                          <label className="text-gray-500">GST Number</label>
                          <p className="font-medium">{seller.gstNumber}</p>
                        </div>
                      )}
                      {seller.bankDetails && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-gray-500">Bank Name</label>
                            <p className="font-medium">
                              {seller.bankDetails.bankName}
                            </p>
                          </div>
                          <div>
                            <label className="text-gray-500">
                              Account Number
                            </label>
                            <p className="font-medium">
                              {seller.bankDetails.accountNumber}
                            </p>
                          </div>
                          <div>
                            <label className="text-gray-500">IFSC Code</label>
                            <p className="font-medium">
                              {seller.bankDetails.ifscCode}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Documents */}
              {seller.dealerCertificate && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                      <FileCheck className="h-4 w-4" />
                      Documents
                    </h3>
                    <div className="text-sm">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-green-500" />
                          <span>Dealer Certificate</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto w-full max-h-[calc(100vh-4rem)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Product Details</TableHead>
            <TableHead>Seller Name</TableHead>
            <TableHead>Seller Details</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product._id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsProductDetailOpen(true);
                  }}
                >
                  <Info className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </TableCell>
              <TableCell>{product.seller?.proprietorName}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsSellerDetailOpen(true);
                  }}
                >
                  <Info className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(product, "rejected")}
                  className="bg-red-50 hover:bg-red-100 text-red-600"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleAction(product, "approved")}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Approve
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Action Confirmation Dialog */}
      <AlertDialog
        open={isActionDialogOpen}
        onOpenChange={setIsActionDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === "approved" ? "Approve Product" : "Reject Product"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {action} {selectedProduct?.name}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={
                action === "approved"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              Confirm {action === "approved" ? "Approval" : "Rejection"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Product Detail Dialog */}
      {selectedProduct && (
        <ProductDetailDialog
          product={selectedProduct}
          open={isProductDetailOpen}
          onClose={() => setIsProductDetailOpen(false)}
        />
      )}

      {/* Seller Detail Dialog */}
      {selectedProduct && (
        <SellerDetailDialog
          seller={selectedProduct.seller}
          open={isSellerDetailOpen} // Add this
          onClose={() => setIsSellerDetailOpen(false)} // Change this
        />
      )}
    </div>
  );
};

export default PendingProductsTable;
