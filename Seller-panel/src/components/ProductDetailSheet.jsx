import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Info,
  DollarSign,
  Package,
  Settings,
  ImageIcon,
  Star,
  Check,
  ListChecks,
  FolderTree,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import PropTypes from "prop-types";

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
            {product._id && ` - ${product._id}`}
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

ProductDetailDialog.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    brand: PropTypes.string,
    model: PropTypes.string,
    type: PropTypes.string,
    mainCategory: PropTypes.string,
    category: PropTypes.string,
    price: PropTypes.number,
    discount: PropTypes.number,
    inStock: PropTypes.number,
    availability: PropTypes.bool,
    features: PropTypes.arrayOf(PropTypes.string),
    specifications: PropTypes.object,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.number,
    reviews: PropTypes.number,
    createdAt: PropTypes.string,
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

ProductDetailDialog.defaultProps = {
  product: null,
};

export default ProductDetailDialog;
