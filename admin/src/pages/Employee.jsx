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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

const EmployeeManagement = ({ token }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emptyEmployee = {
    name: "",
    role: "",
    specialization: "",
    phone: "",
    email: "",
    status: "Active",
    joiningDate: ""
  };

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState(emptyEmployee);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/employees/list`, {
        headers: { token }
      });
      setEmployees(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  // Add employee
  const handleAddEmployee = async () => {
    try {
      setSubmitting(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/employees/add`, 
        newEmployee,
        { headers: { token } }
      );
      
      setEmployees([...employees, response.data.data]);
      setNewEmployee(emptyEmployee);
      setIsAddDialogOpen(false);
      toast.success('Employee added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add employee');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Edit employee
  const handleEditClick = (employee) => {
    setEditingEmployee({ ...employee });
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      setSubmitting(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/employees/${editingEmployee._id}`,
        editingEmployee,
        { headers: { token } }
      );
      
      setEmployees(employees.map(emp => 
        emp._id === editingEmployee._id ? response.data.data : emp
      ));
      setIsEditDialogOpen(false);
      setEditingEmployee(null);
      toast.success('Employee updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update employee');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete employee
  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/employees/${id}`, {
          headers: { token }
        });
        
        setEmployees(employees.filter(emp => emp._id !== id));
        toast.success('Employee deleted successfully');
      } catch (error) {
        toast.error('Failed to delete employee');
        console.error('Error:', error);
      }
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form validation
  const validateForm = (employee) => {
    const errors = {};
    if (!employee.name) errors.name = 'Name is required';
    if (!employee.email) errors.email = 'Email is required';
    if (!employee.phone) errors.phone = 'Phone is required';
    if (!employee.role) errors.role = 'Role is required';
    if (!employee.specialization) errors.specialization = 'Specialization is required';
    if (!employee.joiningDate) errors.joiningDate = 'Joining date is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (employee.email && !emailRegex.test(employee.email)) {
      errors.email = 'Invalid email format';
    }

    return errors;
  };

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Employee Management</CardTitle>
          <div className="flex space-x-4">
            <div className="flex items-center border rounded-md px-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search employees..."
                className="border-0 focus:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  />
                  <Input
                    placeholder="Role"
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                  />
                  <Input
                    placeholder="Specialization"
                    value={newEmployee.specialization}
                    onChange={(e) => setNewEmployee({...newEmployee, specialization: e.target.value})}
                  />
                  <Input
                    placeholder="Phone"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  />
                  <Input
                    placeholder="Join Date"
                    type="date"
                    value={newEmployee.joiningDate}
                    onChange={(e) => setNewEmployee({...newEmployee, joiningDate: e.target.value})}
                  />
                  <Button 
                    className="w-full" 
                    onClick={handleAddEmployee}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Employee'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.specialization}</TableCell>
                    <TableCell>
                      <div>
                        <div>{employee.phone}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(employee.joiningDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditClick(employee)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteEmployee(employee._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Name"
              value={editingEmployee?.name || ''}
              onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
            />
            <Input
              placeholder="Role"
              value={editingEmployee?.role || ''}
              onChange={(e) => setEditingEmployee({...editingEmployee, role: e.target.value})}
            />
            <Input
              placeholder="Specialization"
              value={editingEmployee?.specialization || ''}
              onChange={(e) => setEditingEmployee({...editingEmployee, specialization: e.target.value})}
            />
            <Input
              placeholder="Phone"
              value={editingEmployee?.phone || ''}
              onChange={(e) => setEditingEmployee({...editingEmployee, phone: e.target.value})}
            />
            <Input
              placeholder="Email"
              type="email"
              value={editingEmployee?.email || ''}
              onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
            />
            <Input
              placeholder="Join Date"
              type="date"
              value={editingEmployee?.joiningDate?.split('T')[0] || ''}
              onChange={(e) => setEditingEmployee({...editingEmployee, joiningDate: e.target.value})}
            />
            <Button 
              className="w-full" 
              onClick={handleEditSave}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;