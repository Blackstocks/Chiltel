import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

// Product types and categories based on schema
const PRODUCT_TYPES = [
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

const CATEGORIES = ["Installation", "Service", "Repair"];

const ServicesManagement = ({ token }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState([]);

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    discount: 0,
    product: "",
    category: "",
    estimatedDuration: "",
    isAvailable: true,
    requirements: []
  });

  const [filters, setFilters] = useState({
    product: "all",
    category: "all",
    availability: "all"
  });

  // Fetch services from backend
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/services`,
        {
          headers: { token }
        }
      );
      console.log('Services fetched:', response.data);
      setServices(Array.isArray(response.data.data) ? response.data.data : response.data.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [token]);

  const handleRequirementsChange = (value, isEdit) => {
    const requirementsArray = value.split(',').map(item => item.trim()).filter(Boolean);
    if (isEdit) {
      setEditingService({...editingService, requirements: requirementsArray});
    } else {
      setNewService({...newService, requirements: requirementsArray});
    }
  };

  const handleAddService = async (formData) => {
    try {
      setIsLoading(true);
      
      const serviceData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        discount: Number(formData.discount),
        product: formData.product,
        category: formData.category,
        estimatedDuration: formData.estimatedDuration,
        isAvailable: formData.isAvailable,
        requirements: formData.requirements
      };
  
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/services`,
        serviceData,
        { headers: { token } }
      );
      console.log('Service added:', response.data);
  
      await fetchServices();
      setIsAddDialogOpen(false);
      toast.success('Service added successfully');
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error(error.response?.data?.message || 'Failed to add service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditService = async (formData) => {  // Add formData parameter
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/services/update/${editingService._id}`,
        formData,  // Use formData instead of editingService
        {
          headers: { token }
        }
      );
  
      setServices(prev => 
        prev.map(service => 
          service._id === editingService._id ? response.data.data : service  // Access response.data.data
        )
      );
      setIsEditDialogOpen(false);
      setEditingService(null);
      toast.success('Service updated successfully');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error(error.response?.data?.message || 'Failed to update service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/services/delete/${id}`,
        {
          headers: { token }
        }
      );
      
      setServices(prev => prev.filter(service => service._id !== id));
      toast.success('Service deleted successfully');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    } finally {
      setIsLoading(false);
    }
  };

  const ServiceForm = ({ isEdit, onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
      name: '',
      description: '',
      price: '',
      discount: '',
      product: '',
      category: '',
      estimatedDuration: '',
      requirements: [],
      isAvailable: true
    });
  
    const handleRequirementsChange = (value) => {
      const requirements = value.split(',').map(req => req.trim()).filter(Boolean);
      setFormData({ ...formData, requirements });
    };
  
    return (
      <div className="space-y-4">
        <Input
          placeholder="Service Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        
        <Textarea
          placeholder="Service Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
  
        <div className="flex space-x-4">
          <Input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="flex-1"
          />
          <Input
            type="number"
            placeholder="Discount"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
            className="flex-1"
          />
        </div>
  
        <Select
          value={formData.product}
          onValueChange={(value) => setFormData({ ...formData, product: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Product" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_TYPES.map((product) => (
              <SelectItem key={product} value={product}>{product}</SelectItem>
            ))}
          </SelectContent>
        </Select>
  
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
  
        <Input
          placeholder="Estimated Duration (e.g., 2-3 hours)"
          value={formData.estimatedDuration}
          onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
        />
  
        <Textarea
          placeholder="Requirements (comma-separated)"
          value={formData.requirements.join(', ')}
          onChange={(e) => handleRequirementsChange(e.target.value)}
        />
  
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label>Available</label>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button onClick={() => onSave(formData)}  className="flex-1" disabled={isLoading}>
            {isEdit ? "Update Service" : "Add Service"}
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex-1" disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = 
    (service.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (service.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesProduct = 
      filters.product === "all" || service.product === filters.product;

    const matchesCategory = 
      filters.category === "all" || service.category === filters.category;

    const matchesAvailability = 
      filters.availability === "all" || 
      (filters.availability === "available" ? service.isAvailable : !service.isAvailable);

    return matchesSearch && matchesProduct && matchesCategory && matchesAvailability;
  });

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Services Management</CardTitle>
          <div className="flex space-x-4">
            <div className="flex items-center border rounded-md px-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search services..."
                className="border-0 focus:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Service</DialogTitle>
                </DialogHeader>
                <ServiceForm
                  isEdit={false}
                  onSave={handleAddService}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <div className="px-6 py-4 border-b flex space-x-4">
          <Select
            value={filters.product}
            onValueChange={(value) => setFilters({...filters, product: value})}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {PRODUCT_TYPES.map((product) => (
                <SelectItem key={product} value={product}>{product}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({...filters, category: value})}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.availability}
            onValueChange={(value) => setFilters({...filters, availability: value})}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Loading services...
                  </TableCell>
                </TableRow>
              ) : filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No services found
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service._id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{service.product}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>
                      ₹{service.price?.toLocaleString()}
                      {service.discount > 0 && (
                        <span className="text-green-600 text-sm ml-2">
                          (-₹{service.discount})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{service.estimatedDuration}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        service.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {service.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEditingService(service);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteService(service._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          {editingService && (
            <ServiceForm
              isEdit={true}
              onSave={handleEditService}
              onCancel={() => setIsEditDialogOpen(false)}
              initialData={editingService} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesManagement;