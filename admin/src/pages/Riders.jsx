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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Trash2, Loader2, CalendarCheck, MoreVertical, User } from "lucide-react";
import { Star as StarIcon } from "lucide-react";
import ReferralCodeDialog from "@/components/ReferralCodeDialog";
import PendingRidersDialog from "@/components/PendingRidersTable";
import ExportButtons from "../components/RiderExportButton";
import RiderAttendance from "@/components/RiderAttendance";
import RiderProfileDialog from "@/components/PendingRiderProfileDialog";

const RiderManagement = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRider, setSelectedRider] = useState(null);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleViewProfile = (rider) => {
    setSelectedRider(rider);
    setIsProfileOpen(true);
  };


   // Handle view attendance details
   const handleViewAttendance = (rider) => {
    setSelectedRider(rider);
    setIsAttendanceOpen(true);
  };

  // Fetch riders
  const fetchriders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/riders/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
  }, []);

  // Delete rider
  const handleDeleteRider = async (id) => {
    if (window.confirm("Are you sure you want to delete this rider?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/riders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
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

  const filteredRiders = riders?.filter((rider) => {
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

  return (
    <div className="">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">
            Riders Management
          </CardTitle>
          <div className="flex space-x-4">
            <ExportButtons data={filteredRiders} type="riders"/>
            <ReferralCodeDialog />
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
                {filteredRiders?.map((rider) => (
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

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewProfile(rider)}
                          className="gap-2"
                        >
                          <User className="h-4 w-4" />
                          <span>View Profile</span>
                        </DropdownMenuItem>
                          {/* <DropdownMenuItem
                            onClick={() => handleViewAttendance(rider)}
                            className="cursor-pointer"
                          >
                            <CalendarCheck className="mr-2 h-4 w-4" />
                            <span>Attendance details</span>
                          </DropdownMenuItem> */}
                          <DropdownMenuItem
                            onClick={() => handleDeleteRider(rider._id)}
                            className="cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span>Delete Rider</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Attendance Dialog */}
      <Dialog open={isAttendanceOpen} onOpenChange={setIsAttendanceOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Attendance Record - {selectedRider ? `${selectedRider.firstName} ${selectedRider.lastName}` : ''}
            </DialogTitle>
          </DialogHeader>
          {selectedRider && (
            <RiderAttendance 
              riderId={selectedRider._id}
              riderName={`${selectedRider.firstName} ${selectedRider.lastName}`}
              phoneNumber={selectedRider.phoneNumber}
            />
          )}
        </DialogContent>
      </Dialog>

      <RiderProfileDialog
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setSelectedRider(null);
        }}
        rider={selectedRider}
      />
    </div>

    
  );
};

export default RiderManagement;
