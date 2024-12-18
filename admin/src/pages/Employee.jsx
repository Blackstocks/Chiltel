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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';

const EmployeeManagement = () => {
  // Sample initial employee data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Doe",
      role: "Senior Technician",
      specialization: "HVAC",
      phone: "+1 234-567-8901",
      email: "john.doe@example.com",
      status: "Active",
      joinDate: "2023-01-15"
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Electrician",
      specialization: "Home Appliances",
      phone: "+1 234-567-8902",
      email: "jane.smith@example.com",
      status: "Active",
      joinDate: "2023-03-20"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const emptyEmployee = {
    name: "",
    role: "",
    specialization: "",
    phone: "",
    email: "",
    status: "Active",
    joinDate: ""
  };
  
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState(emptyEmployee);

  const handleAddEmployee = () => {
    setEmployees([...employees, { ...newEmployee, id: employees.length + 1 }]);
    setNewEmployee(emptyEmployee);
    setIsAddDialogOpen(false);
  };

  const handleEditClick = (employee) => {
    setEditingEmployee({ ...employee });
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    setEmployees(employees.map(emp => 
      emp.id === editingEmployee.id ? editingEmployee : emp
    ));
    setIsEditDialogOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    value={newEmployee.joinDate}
                    onChange={(e) => setNewEmployee({...newEmployee, joinDate: e.target.value})}
                  />
                  <Button className="w-full" onClick={handleAddEmployee}>
                    Add Employee
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
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
                <TableRow key={employee.id}>
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
                  <TableCell>{employee.joinDate}</TableCell>
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
                        onClick={() => handleDeleteEmployee(employee.id)}
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
              value={editingEmployee?.joinDate || ''}
              onChange={(e) => setEditingEmployee({...editingEmployee, joinDate: e.target.value})}
            />
            <Button className="w-full" onClick={handleEditSave}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;