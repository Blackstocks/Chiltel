import { useState, useEffect } from 'react';
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
    category: "",
    discountedprice: "",
    discount: 0,
    rating: 0,
    reviews: 0,
    features: [''],
    specifications: {
      capacity: "",
      starRating: "",
      powerConsumption: "",
      cooling: "",
      ambientOperation: "",
      waterproofRating: "",
    },
    availability: true,
    imageUrls: [''],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const categories = [
    "Deep Freezer",
    "Visi-Cooler",
    "AC",
    "Refrigerator",
    "Water Cooler"
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (formData.discount < 0 || formData.discount > 100) newErrors.discount = 'Invalid discount percentage';
    if (formData.rating < 0 || formData.rating > 5) newErrors.rating = 'Rating must be between 0 and 5';
    if (formData.reviews < 0) newErrors.reviews = 'Reviews cannot be negative';
    
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
        features: formData.features.filter(f => f.trim() !== ''),
        imageUrls: formData.imageUrls.filter(url => url.trim() !== '')
      };
      onSubmit(formattedData);
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    if (index === newFeatures.length - 1 && value.trim() !== '') {
      newFeatures.push('');
    }
    setFormData({ ...formData, features: newFeatures });
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...formData.imageUrls];
    newUrls[index] = value;
    if (index === newUrls.length - 1 && value.trim() !== '') {
      newUrls.push('');
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
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className={errors.brand ? 'border-red-500' : ''}
          />
          {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className={errors.model ? 'border-red-500' : ''}
          />
          {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
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
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            className={errors.discount ? 'border-red-500' : ''}
          />
          {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
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
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            className={errors.rating ? 'border-red-500' : ''}
          />
          {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reviews">Number of Reviews</Label>
          <Input
            id="reviews"
            type="number"
            min="0"
            value={formData.reviews}
            onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
            className={errors.reviews ? 'border-red-500' : ''}
          />
          {errors.reviews && <p className="text-red-500 text-sm">{errors.reviews}</p>}
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Specifications</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              value={formData.specifications.capacity}
              onChange={(e) => setFormData({
                ...formData,
                specifications: { ...formData.specifications, capacity: e.target.value }
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="starRating">Star Rating</Label>
            <Select
              value={formData.specifications.starRating}
              onValueChange={(value) => setFormData({
                ...formData,
                specifications: { ...formData.specifications, starRating: value }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating} Star
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="powerConsumption">Power Consumption</Label>
            <Input
              id="powerConsumption"
              value={formData.specifications.powerConsumption}
              onChange={(e) => setFormData({
                ...formData,
                specifications: { ...formData.specifications, powerConsumption: e.target.value }
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cooling">Cooling</Label>
            <Input
              id="cooling"
              value={formData.specifications.cooling}
              onChange={(e) => setFormData({
                ...formData,
                specifications: { ...formData.specifications, cooling: e.target.value }
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ambientOperation">Ambient Operation</Label>
            <Input
              id="ambientOperation"
              value={formData.specifications.ambientOperation}
              onChange={(e) => setFormData({
                ...formData,
                specifications: { ...formData.specifications, ambientOperation: e.target.value }
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waterproofRating">Waterproof Rating</Label>
            <Input
              id="waterproofRating"
              value={formData.specifications.waterproofRating}
              onChange={(e) => setFormData({
                ...formData,
                specifications: { ...formData.specifications, waterproofRating: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-2">
        <Label>Features</Label>
        {formData.features.map((feature, index) => (
          <Input
            key={index}
            value={feature}
            onChange={(e) => handleFeatureChange(index, e.target.value)}
            placeholder={`Feature ${index + 1}`}
            className="mb-2"
          />
        ))}
      </div>

      {/* Image URLs */}
      <div className="space-y-2">
        <Label>Image URLs</Label>
        {formData.imageUrls.map((url, index) => (
          <Input
            key={index}
            value={url}
            onChange={(e) => handleImageUrlChange(index, e.target.value)}
            placeholder={`Image URL ${index + 1}`}
            className="mb-2"
          />
        ))}
      </div>

      {/* Availability */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="availability">Availability</Label>
        <Switch
          id="availability"
          checked={formData.availability}
          onCheckedChange={(checked) => setFormData({ ...formData, availability: checked })}
        />
        <span className="text-sm text-gray-500">
          {formData.availability ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;