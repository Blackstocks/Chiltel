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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Trash2, Loader2 } from "lucide-react";
import { Star as StarIcon } from "lucide-react";
import ReferralCodeDialog from "@/components/ReferralCodeDialog";
import PendingRidersDialog from "@/components/PendingRidersTable";
import ExportButtons from "../components/RiderExportButton";

const RiderManagement = ({ token }) => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredRiders = riders.filter((rider) => {
    const name = rider?.name || "";
    const specialization = rider?.specialization || "";
    const email = rider?.email || "";
    const phoneNumber = rider?.phoneNumber || "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
            <ExportButtons data={filteredRiders} type="riders"/>
            <ReferralCodeDialog  token={token}/>
            <div className="flex items-center border rounded-md px-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search employees..."
                className="border-0 focus:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <PendingRidersDialog
              token={token}
              onRiderApproved={() => {
                console.log("Rider approved");
                fetchriders();
              }}
            />
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRiders.map((rider) => (
                  <TableRow key={rider._id}>
                    <TableCell className="font-medium">
                      {rider.firstName + " " + rider.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {rider.specializations.map((spec, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </TableCell>
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
                        {rider?.rating?.average?.toFixed(1) || "0.0"} (
                        {rider?.rating?.count || 0})
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
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
    </div>
  );
};

export default RiderManagement;
