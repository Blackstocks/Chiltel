import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Plus, Upload } from "lucide-react";

const AddProductForm = ({ onSubmit, onClose, initialData = null }) => {
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState(initialData?.features || []);
  const [newFeature, setNewFeature] = useState('');
  const [specifications, setSpecifications] = useState(initialData?.specifications || {});
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [formData, setFormData] = useState(initialData || {
    name: '',
    brand: '',
    model: '',
    mainCategory: '',
    type: '',
    category: '',
    price: '',
    discount: 0,
    inStock: 0,
    thumbnail: '',
    imageUrls: []
  });

  const mainCategories = ["Retail", "Domestic Appliance", "Kitchen"];
  const types = ["water", "cooling", "heating", "cooking", "cleaning", "display"];
  // Import productEnums from your constants

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecifications(prev => ({
        ...prev,
        [newSpecKey.trim()]: newSpecValue.trim()
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const handleRemoveSpecification = (key) => {
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    setSpecifications(newSpecs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const productData = {
      ...formData,
      features,
      specifications,
      price: Number(formData.price),
      discount: Number(formData.discount),
      inStock: Number(formData.inStock)
    };

    try {
      await onSubmit(productData);
      onClose();
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Main Category</Label>
          <Select
            value={formData.mainCategory}
            onValueChange={(value) => 
              setFormData(prev => ({ ...prev, mainCategory: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {mainCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => 
              setFormData(prev => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Discount (0-1)</Label>
          <Input
            id="discount"
            name="discount"
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={formData.discount}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inStock">Stock Quantity</Label>
          <Input
            id="inStock"
            name="inStock"
            type="number"
            min="0"
            value={formData.inStock}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-2">
        <Label>Features</Label>
        <div className="flex space-x-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add a feature"
          />
          <Button type="button" onClick={handleAddFeature}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span>{feature}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFeature(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Specifications Section */}
      <div className="space-y-2">
        <Label>Specifications</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            value={newSpecKey}
            onChange={(e) => setNewSpecKey(e.target.value)}
            placeholder="Specification key"
          />
          <div className="flex space-x-2">
            <Input
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              placeholder="Specification value"
            />
            <Button type="button" onClick={handleAddSpecification}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {Object.entries(specifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span>
                <strong>{key}:</strong> {value}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSpecification(key)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <Label>Images</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Thumbnail</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="Thumbnail URL"
                required
              />
              <Button type="button">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Additional Images</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Image URL"
                value={formData.newImageUrl}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, newImageUrl: e.target.value }))
                }
              />
              <Button
                type="button"
                onClick={() => {
                  if (formData.newImageUrl) {
                    setFormData(prev => ({
                      ...prev,
                      imageUrls: [...prev.imageUrls, prev.newImageUrl],
                      newImageUrl: ''
                    }));
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {formData.imageUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Product image ${index + 1}`}
                className="w-full h-24 object-cover rounded"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    imageUrls: prev.imageUrls.filter((_, i) => i !== index)
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
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;