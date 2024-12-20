import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddProductForm = ({ onSubmit, onClose, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    mainCategory: "", // enum: ["Retail", "Domestic Appliance", "Kitchen"]
    type: "", // enum: ["water", "cooling", "heating", "cooking", "cleaning", "display"]
    category: "", // enum from productEnums
    price: "",
    discount: 0, // between 0 and 1
    rating: 0, // between 0 and 5
    reviews: 0,
    features: [""], // Array of strings
    specifications: {}, // Flexible object for different product types
    inStock: 0,
    availability: true, // Auto-computed based on inStock
    thumbnail: "", // Required
    imageUrls: [""], // Array of strings
    createdAt: new Date(), // Auto-generated
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const mainCategories = ["Retail", "Domestic Appliance", "Kitchen"];

  const types = [
    "water",
    "cooling",
    "heating",
    "cooking",
    "cleaning",
    "display",
  ];

  const categories = [
    "Air Conditioner",
    "Water Heater",
    "Microwave",
    "Geyser",
    "Refrigerator",
    "Washing Machine",
    "Air Cooler",
    "Air Purifier",
    "Water Purifier",
    "Deep Freezer",
    "Visi Cooler",
    "Cassette AC",
    "Water Cooler cum Purifier",
    "Water Dispenser",
    "Display Counter",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (formData.discount < 0 || formData.discount > 100)
      newErrors.discount = "Invalid discount percentage";
    if (formData.rating < 0 || formData.rating > 5)
      newErrors.rating = "Rating must be between 0 and 5";
    if (formData.reviews < 0) newErrors.reviews = "Reviews cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formattedData = {
        ...formData,
        price: Number(formData.price),
        discount: Number(formData.discount),
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
        features: formData.features.filter((f) => f.trim() !== ""),
        imageUrls: formData.imageUrls.filter((url) => url.trim() !== ""),
      };
      onSubmit(formattedData);
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    if (index === newFeatures.length - 1 && value.trim() !== "") {
      newFeatures.push("");
    }
    setFormData({ ...formData, features: newFeatures });
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...formData.imageUrls];
    newUrls[index] = value;
    if (index === newUrls.length - 1 && value.trim() !== "") {
      newUrls.push("");
    }
    setFormData({ ...formData, imageUrls: newUrls });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className={errors.brand ? "border-red-500" : ""}
          />
          {errors.brand && (
            <p className="text-red-500 text-sm">{errors.brand}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
            className={errors.model ? "border-red-500" : ""}
          />
          {errors.model && (
            <p className="text-red-500 text-sm">{errors.model}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mainCategory">Main Category</Label>
          <Select
            value={formData.mainCategory}
            onValueChange={(value) =>
              setFormData({ ...formData, mainCategory: value })
            }
          >
            <SelectTrigger
              className={errors.mainCategory ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select mainCategory" />
            </SelectTrigger>
            <SelectContent>
              {mainCategories.map((mainCategory) => (
                <SelectItem key={mainCategory} value={mainCategory}>
                  {mainCategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.mainCategory && (
            <p className="text-red-500 text-sm">{errors.mainCategory}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className={errors.type ? "border-red-500" : ""}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inStock">InStock</Label>
          <Input
            id="inStock"
            type="number"
            min="0"
            value={formData.inStock}
            onChange={(e) =>
              setFormData({ ...formData, inStock: e.target.value })
            }
            className={errors.inStock ? "border-red-500" : ""}
          />
          {errors.inStock && (
            <p className="text-red-500 text-sm">{errors.inStock}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            value={formData.discount}
            onChange={(e) =>
              setFormData({ ...formData, discount: e.target.value })
            }
            className={errors.discount ? "border-red-500" : ""}
          />
          {errors.discount && (
            <p className="text-red-500 text-sm">{errors.discount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: e.target.value })
            }
            className={errors.rating ? "border-red-500" : ""}
          />
          {errors.rating && (
            <p className="text-red-500 text-sm">{errors.rating}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reviews">Number of Reviews</Label>
          <Input
            id="reviews"
            type="number"
            min="0"
            value={formData.reviews}
            onChange={(e) =>
              setFormData({ ...formData, reviews: e.target.value })
            }
            className={errors.reviews ? "border-red-500" : ""}
          />
          {errors.reviews && (
            <p className="text-red-500 text-sm">{errors.reviews}</p>
          )}
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Specifications</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                ...formData,
                specifications: {
                  ...formData.specifications,
                  "": "", // Add empty key-value pair
                },
              });
            }}
          >
            Add New Specification
          </Button>
        </div>

        <div className="space-y-4">
          {Object.entries(formData.specifications).map(
            ([key, value], index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <Label>Specification Name</Label>
                  <Input
                    placeholder="Enter specification name"
                    value={key}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      const newSpecs = Object.entries(
                        formData.specifications
                      ).reduce(
                        (acc, [k, v]) => ({
                          ...acc,
                          [k === key ? newKey : k]: v,
                        }),
                        {}
                      );

                      setFormData({
                        ...formData,
                        specifications: newSpecs,
                      });
                    }}
                  />
                </div>

                <div className="flex-1">
                  <Label>Value</Label>
                  <Input
                    placeholder="Enter value"
                    value={value}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          [key]: e.target.value,
                        },
                      });
                    }}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="mt-6"
                  onClick={() => {
                    const { [key]: _, ...restSpecs } = formData.specifications;
                    setFormData({
                      ...formData,
                      specifications: restSpecs,
                    });
                  }}
                >
                  ✕
                </Button>
              </div>
            )
          )}
        </div>

        {Object.keys(formData.specifications).length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No specifications added yet. Click 'Add New Specification' to add
            product specifications.
          </p>
        )}
      </div>

      {/* Features */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Product Features</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                ...formData,
                features: [...formData.features, ""],
              });
            }}
          >
            Add Feature
          </Button>
        </div>

        <div className="space-y-3">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Feature ${index + 1}`}
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...formData.features];
                  newFeatures[index] = e.target.value;
                  setFormData({
                    ...formData,
                    features: newFeatures,
                  });
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const newFeatures = formData.features.filter(
                    (_, i) => i !== index
                  );
                  setFormData({
                    ...formData,
                    features: newFeatures,
                  });
                }}
              >
                ✕
              </Button>
            </div>
          ))}
        </div>

        {formData.features.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">
            No features added yet. Click Add Feature to add product features.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Product Thumbnail</Label>
        <Input
          id="thumbnail"
          placeholder="Enter thumbnail URL"
          value={formData.thumbnail}
          onChange={(e) =>
            setFormData({ ...formData, thumbnail: e.target.value })
          }
          className={errors.thumbnail ? "border-red-500" : ""}
        />
        {errors.thumbnail && (
          <p className="text-red-500 text-sm">{errors.thumbnail}</p>
        )}
      </div>

      {/* Image URLs */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Product Images</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                ...formData,
                imageUrls: [...formData.imageUrls, ""],
              });
            }}
          >
            Add Image URL
          </Button>
        </div>

        <div className="space-y-3">
          {formData.imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Image URL ${index + 1}`}
                value={url}
                onChange={(e) => {
                  const newUrls = [...formData.imageUrls];
                  newUrls[index] = e.target.value;
                  setFormData({
                    ...formData,
                    imageUrls: newUrls,
                  });
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const newUrls = formData.imageUrls.filter(
                    (_, i) => i !== index
                  );
                  setFormData({
                    ...formData,
                    imageUrls: newUrls,
                  });
                }}
              >
                ✕
              </Button>
            </div>
          ))}
        </div>

        {formData.imageUrls.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">
            No image URLs added yet. Click 'Add Image URL' to add product
            images.
          </p>
        )}
      </div>

      {/* Availability */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="availability">Availability</Label>
        <Switch
          id="availability"
          checked={formData.availability}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, availability: checked })
          }
        />
        <span className="text-sm text-gray-500">
          {formData.availability ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
