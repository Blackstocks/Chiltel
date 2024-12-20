import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Star as StarIcon } from "lucide-react";

const RiderManagement = ({ token }) => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const emptyRider = {
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    specialization: "",
    status: "OFFLINE", // Default status
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  };

  const [newRider, setNewRider] = useState(emptyRider);

  const [editingRider, setEditingRider] = useState(null);

  // Fetch riders
  const fetchriders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/riders/list`,
        {
          headers: { token },
        }
      );
      setRiders(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch riders");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchriders();
  }, [token]);

  // Add rider
  const handleAddRider = async () => {
    console.log("Submitting rider data:", newRider); // Add this

    const validationErrors = validateForm(newRider);

    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation errors:", validationErrors); // Add this
      setErrors(validationErrors);
      return;
    }
    try {
      setSubmitting(true);

      // Format the data before sending
      const riderData = {
        ...newRider,
        location: {
          type: "Point",
          coordinates: [
            parseFloat(newRider.location.coordinates[0]),
            parseFloat(newRider.location.coordinates[1]),
          ],
        },
      };

      console.log("Sending data to server:", riderData); // Add this

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/riders/add`,
        riderData,
        {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      console.log("Server response:", response.data); // Add this

      if (response.data.success) {
        setRiders([...riders, response.data.data]);
        setNewRider(emptyRider);
        setIsAddDialogOpen(false);
        toast.success("Rider added successfully");
      } else {
        toast.error(response.data.message || "Failed to add rider");
      }
    } catch (error) {
      console.error("Detailed error:", error); // More detailed error logging

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        toast.error(error.response.data.message || "Server error occurred");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        toast.error("No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        toast.error("Error setting up request");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Edit employee
  const handleEditClick = (rider) => {
    setEditingRider({ ...rider });
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      setSubmitting(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/riders/${editingRider._id}`,
        editingRider,
        { headers: { token } }
      );

      setRiders(
        riders.map((emp) =>
          emp._id === editingRider._id ? response.data.data : emp
        )
      );
      setIsEditDialogOpen(false);
      setEditingRider(null);
      toast.success("Rider updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update rider");
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete rider
  const handleDeleteRider = async (id) => {
    if (window.confirm("Are you sure you want to delete this rider?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/riders/${id}`,
          {
            headers: { token },
          }
        );

        setRiders(riders.filter((emp) => emp._id !== id));
        toast.success("Rider deleted successfully");
      } catch (error) {
        toast.error("Failed to delete rider");
        console.error("Error:", error);
      }
    }
  };

  const filteredRiders = riders.filter(
    (rider) =>
      rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form validation
  const validateForm = (rider) => {
    const errors = {};

    // Required field validations
    if (!rider.name) errors.name = "Name is required";
    if (!rider.email) errors.email = "Email is required";
    if (!rider.password) errors.password = "Password is required";
    if (!rider.phoneNumber) errors.phoneNumber = "Phone number is required";
    if (!rider.specialization)
      errors.specialization = "Specialization is required";
    if (!rider.location?.coordinates) errors.location = "Location is required";

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (rider.email && !emailRegex.test(rider.email)) {
      errors.email = "Invalid email format";
    }

    // Password strength validation
    if (rider.password && rider.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Specialization enum validation
    const validSpecializations = ["AC", "Cooler", "Microwave"];
    if (
      rider.specialization &&
      !validSpecializations.includes(rider.specialization)
    ) {
      errors.specialization = "Invalid specialization selected";
    }

    // Location coordinates validation
    if (rider.location?.coordinates) {
      const [longitude, latitude] = rider.location.coordinates;

      if (longitude < -180 || longitude > 180) {
        errors.longitude = "Longitude must be between -180 and 180";
      }
      if (latitude < -90 || latitude > 90) {
        errors.latitude = "Latitude must be between -90 and 90";
      }
    }

    // Phone number format validation (basic)
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (rider.phoneNumber && !phoneRegex.test(rider.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number format";
    }

    return errors;
  };

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">
            Riders Management
          </CardTitle>
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
                  Add Rider
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Rider</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Name"
                    value={newRider.name}
                    onChange={(e) =>
                      setNewRider({ ...newRider, name: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Email"
                    type="email"
                    value={newRider.email}
                    onChange={(e) =>
                      setNewRider({ ...newRider, email: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Password"
                    type="password"
                    value={newRider.password}
                    onChange={(e) =>
                      setNewRider({ ...newRider, password: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Phone Number"
                    value={newRider.phoneNumber}
                    onChange={(e) =>
                      setNewRider({ ...newRider, phoneNumber: e.target.value })
                    }
                  />

                  <Select
                    value={newRider.specialization}
                    onValueChange={(value) =>
                      setNewRider({ ...newRider, specialization: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AC">AC</SelectItem>
                      <SelectItem value="Cooler">Cooler</SelectItem>
                      <SelectItem value="Microwave">Microwave</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Longitude"
                      type="number"
                      value={newRider.location?.coordinates[0] || ""}
                      onChange={(e) =>
                        setNewRider({
                          ...newRider,
                          location: {
                            type: "Point",
                            coordinates: [
                              parseFloat(e.target.value),
                              newRider.location?.coordinates[1] || 0,
                            ],
                          },
                        })
                      }
                    />
                    <Input
                      placeholder="Latitude"
                      type="number"
                      value={newRider.location?.coordinates[1] || ""}
                      onChange={(e) =>
                        setNewRider({
                          ...newRider,
                          location: {
                            type: "Point",
                            coordinates: [
                              newRider.location?.coordinates[0] || 0,
                              parseFloat(e.target.value),
                            ],
                          },
                        })
                      }
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleAddRider}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Rider"
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
                  <TableHead>Specialization</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRiders.map((rider) => (
                  <TableRow key={rider._id}>
                    <TableCell className="font-medium">{rider.name}</TableCell>
                    <TableCell>{rider.specialization}</TableCell>
                    <TableCell>
                      <div>
                        <div>{rider.phoneNumber}</div>
                        <div className="text-sm text-gray-500">
                          {rider.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          rider.status === "AVAILABLE"
                            ? "bg-green-100 text-green-800"
                            : rider.status === "BUSY"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {rider.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        {rider.rating.average.toFixed(1)} ({rider.rating.count})
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {rider.location.coordinates[1].toFixed(4)},{" "}
                        {/* Latitude */}
                        {rider.location.coordinates[0].toFixed(4)}{" "}
                        {/* Longitude */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(rider)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRider(rider._id)}
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
            <DialogTitle>Edit Rider</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Name"
              value={editingRider?.name || ""}
              onChange={(e) =>
                setEditingRider({ ...editingRider, name: e.target.value })
              }
            />

            <Input
              placeholder="Email"
              type="email"
              value={editingRider?.email || ""}
              onChange={(e) =>
                setEditingRider({
                  ...editingRider,
                  email: e.target.value,
                })
              }
            />

            <Input
              placeholder="Phone Number"
              value={editingRider?.phoneNumber || ""}
              onChange={(e) =>
                setEditingRider({
                  ...editingRider,
                  phoneNumber: e.target.value,
                })
              }
            />

            <Select
              value={editingRider?.specialization || ""}
              onValueChange={(value) =>
                setEditingRider({ ...editingRider, specialization: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AC">AC</SelectItem>
                <SelectItem value="Cooler">Cooler</SelectItem>
                <SelectItem value="Microwave">Microwave</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={editingRider?.status || ""}
              onValueChange={(value) =>
                setEditingRider({ ...editingRider, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="BUSY">Busy</SelectItem>
                <SelectItem value="OFFLINE">Offline</SelectItem>
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Longitude"
                type="number"
                value={editingRider?.location?.coordinates[0] || ""}
                onChange={(e) =>
                  setEditingRider({
                    ...editingRider,
                    location: {
                      type: "Point",
                      coordinates: [
                        parseFloat(e.target.value),
                        editingRider?.location?.coordinates[1] || 0,
                      ],
                    },
                  })
                }
              />
              <Input
                placeholder="Latitude"
                type="number"
                value={editingRider?.location?.coordinates[1] || ""}
                onChange={(e) =>
                  setEditingRider({
                    ...editingRider,
                    location: {
                      type: "Point",
                      coordinates: [
                        editingRider?.location?.coordinates[0] || 0,
                        parseFloat(e.target.value),
                      ],
                    },
                  })
                }
              />
            </div>

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
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RiderManagement;
