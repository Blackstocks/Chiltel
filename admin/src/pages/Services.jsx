import { useState } from 'react';
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
import { Plus, Search, Pencil, Trash2, Settings } from 'lucide-react';

const ServicesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    price: "",
    duration: "",
    description: "",
    status: "active"
  });

  const [services, setServices] = useState([
    {
      id: 1,
      name: "AC Installation",
      category: "Air Conditioner",
      price: 1500,
      duration: "2-3 hours",
      description: "Professional AC installation service including mounting, piping, and testing",
      status: "active",
      techniciansRequired: 2
    },
    {
      id: 2,
      name: "Refrigerator Repair",
      category: "Refrigerator",
      price: 800,
      duration: "1-2 hours",
      description: "Diagnostic and repair service for all types of refrigerator issues",
      status: "active",
      techniciansRequired: 1
    },
    {
      id: 3,
      name: "Microwave Service",
      category: "Microwave",
      price: 500,
      duration: "1 hour",
      description: "Complete microwave servicing and repair",
      status: "inactive",
      techniciansRequired: 1
    }
  ]);

  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    priceRange: "all"
  });

  const handleAddService = () => {
    setServices([...services, { ...newService, id: services.length + 1 }]);
    setNewService({
      name: "",
      category: "",
      price: "",
      duration: "",
      description: "",
      status: "active"
    });
    setIsAddDialogOpen(false);
  };

  const handleEditService = () => {
    setServices(services.map(service => 
      service.id === editingService.id ? editingService : service
    ));
    setIsEditDialogOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  const ServiceForm = ({ isEdit, data, onSave, onCancel }) => (
    <div className="space-y-4">
      <Input
        placeholder="Service Name"
        value={isEdit ? editingService.name : newService.name}
        onChange={(e) => isEdit 
          ? setEditingService({...editingService, name: e.target.value})
          : setNewService({...newService, name: e.target.value})
        }
      />
      
      <Select
        value={isEdit ? editingService.category : newService.category}
        onValueChange={(value) => isEdit
          ? setEditingService({...editingService, category: value})
          : setNewService({...newService, category: value})
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Air Conditioner">Air Conditioner</SelectItem>
          <SelectItem value="Refrigerator">Refrigerator</SelectItem>
          <SelectItem value="Microwave">Microwave</SelectItem>
          <SelectItem value="Water Heater">Water Heater</SelectItem>
          <SelectItem value="Washing Machine">Washing Machine</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="number"
        placeholder="Price"
        value={isEdit ? editingService.price : newService.price}
        onChange={(e) => isEdit
          ? setEditingService({...editingService, price: e.target.value})
          : setNewService({...newService, price: e.target.value})
        }
      />

      <Input
        placeholder="Duration (e.g., 2-3 hours)"
        value={isEdit ? editingService.duration : newService.duration}
        onChange={(e) => isEdit
          ? setEditingService({...editingService, duration: e.target.value})
          : setNewService({...newService, duration: e.target.value})
        }
      />

      <Textarea
        placeholder="Service Description"
        value={isEdit ? editingService.description : newService.description}
        onChange={(e) => isEdit
          ? setEditingService({...editingService, description: e.target.value})
          : setNewService({...newService, description: e.target.value})
        }
      />

      <Select
        value={isEdit ? editingService.status : newService.status}
        onValueChange={(value) => isEdit
          ? setEditingService({...editingService, status: value})
          : setNewService({...newService, status: value})
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex space-x-3 pt-4">
        <Button onClick={onSave} className="flex-1">
          {isEdit ? "Update Service" : "Add Service"}
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      filters.category === "all" || service.category === filters.category;

    const matchesStatus = 
      filters.status === "all" || service.status === filters.status;

    return matchesSearch && matchesCategory && matchesStatus;
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

        {/* Filters */}
        <div className="px-6 py-4 border-b flex space-x-4">
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({...filters, category: value})}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Air Conditioner">Air Conditioner</SelectItem>
              <SelectItem value="Refrigerator">Refrigerator</SelectItem>
              <SelectItem value="Microwave">Microwave</SelectItem>
              <SelectItem value="Water Heater">Water Heater</SelectItem>
              <SelectItem value="Washing Machine">Washing Machine</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({...filters, status: value})}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>₹{service.price.toLocaleString()}</TableCell>
                  <TableCell>{service.duration}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {service.status === 'active' ? 'Active' : 'Inactive'}
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
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          {editingService && (
            <ServiceForm
              isEdit={true}
              data={editingService}
              onSave={handleEditService}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesManagement;