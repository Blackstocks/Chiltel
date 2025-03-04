import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Building2,
  ShieldAlert,
  MoreHorizontal,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import axios from "axios";
import RiderProfileDialog from "./PendingRiderProfileDialog";

const PendingRidersDialog = ({ onRiderApproved }) => {
  const [pendingRiders, setPendingRiders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState({});

  const [selectedRider, setSelectedRider] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleViewProfile = (rider) => {
    setSelectedRider(rider);
    setIsProfileOpen(true);
  };

  const fetchPendingRiders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/riders/pending/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPendingRiders(response.data.data || []);
      console.log(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch pending riders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRiders();
  }, []);

  const handleApproveRider = async (riderId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/riders/approve/${riderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Rider approved successfully");
      setPendingRiders((prev) => prev.filter((r) => r._id !== riderId));
      onRiderApproved && onRiderApproved();
    } catch (error) {
      toast.error("Failed to approve rider");
    }
  };

  const handleRejectRider = async (riderId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/riders/reject/${riderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Rider rejected");
      setPendingRiders((prev) => prev.filter((r) => r._id !== riderId));
    } catch (error) {
      toast.error("Failed to reject rider");
    }
  };

  const handleBankVerification = async (riderId) => {
    try {
      setVerificationLoading((prev) => ({ ...prev, [riderId]: "bank" }));
      // Find the rider to get their bank details
      const rider = pendingRiders.find((r) => r._id === riderId);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/rider/verify/bank`,
        {
          beneficiaryAccount: rider.bankDetails.accountNumber,
          beneficiaryIFSC: rider.bankDetails.ifscCode,
          beneficiaryMobile: rider.bankDetails.mobileNumber,
          beneficiaryName: rider.bankDetails.holderName,
          riderId,
        }
      );

      console.log(response.data);

      if (response.data.data.result.accountStatus == "VALID") {
        setPendingRiders((prev) =>
          prev.map((rider) =>
            rider._id === riderId
              ? { ...rider, bankDetails: { isVerified: true } }
              : rider
          )
        );
        toast.success("Bank details verified successfully");
      } else {
        toast.error("Bank verification failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to verify bank details"
      );
    } finally {
      setVerificationLoading((prev) => ({ ...prev, [riderId]: null }));
    }
  };

  const handleCriminalCheck = async (riderId) => {
    try {
      setVerificationLoading((prev) => ({ ...prev, [riderId]: "criminal" }));
      // Find the rider to get their details

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/rider/verify/court`,
        {
          riderId,
        }
      );

      console.log(response.data);

      if (response.data.data.code == 200) {
        setPendingRiders((prev) =>
          prev.map((rider) =>
            rider._id === riderId ? { ...rider, isCourtVerified: true } : rider
          )
        );
        toast.success("Criminal background check completed");
      } else {
        toast.error("Criminal background check failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to complete criminal check"
      );
    } finally {
      setVerificationLoading((prev) => ({ ...prev, [riderId]: null }));
    }
  };

  const isVerificationComplete = (rider) => {
    return rider.bankDetails.isVerified && rider.isCourtVerified;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <AlertCircle className="h-4 w-4 mr-2" />
          Pending Riders
          {pendingRiders.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
            >
              {pendingRiders.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Pending Rider Approvals
            {pendingRiders.length > 0 && (
              <Badge variant="secondary">
                {pendingRiders.length}{" "}
                {pendingRiders.length === 1 ? "rider" : "riders"}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : pendingRiders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No Pending Approvals</p>
            <p className="text-sm text-muted-foreground">
              All rider applications have been processed
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specializations</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRiders.map((rider) => (
                <TableRow key={rider._id}>
                  <TableCell className="font-medium">
                    {rider.firstName} {rider.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {rider.specializations.map((spec, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{rider.phoneNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {rider.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Verifications</DropdownMenuLabel>
                        <DropdownMenuItem
                          disabled={
                            rider.bankDetails.isVerified ||
                            verificationLoading[rider._id]
                          }
                          onClick={() => handleBankVerification(rider._id)}
                          className="gap-2"
                        >
                          {verificationLoading[rider._id] === "bank" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Building2 className="h-4 w-4" />
                          )}
                          <span>Bank Verification</span>
                          {rider.bankDetails.isVerified && (
                            <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={
                            rider.isCourtVerified ||
                            verificationLoading[rider._id]
                          }
                          onClick={() => handleCriminalCheck(rider._id)}
                          className="gap-2"
                        >
                          {verificationLoading[rider._id] === "criminal" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ShieldAlert className="h-4 w-4" />
                          )}
                          <span>Criminal Check</span>
                          {rider.isCourtVerified && (
                            <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={() => handleViewProfile(rider)}
                          className="gap-2"
                        >
                          <User className="h-4 w-4" />
                          <span>View Profile</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          // disabled={!isVerificationComplete(rider)}
                          onClick={() => handleApproveRider(rider._id)}
                          className="gap-2 text-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve Rider</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleRejectRider(rider._id)}
                          className="gap-2 text-red-600"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject Rider</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>

      <RiderProfileDialog
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setSelectedRider(null);
        }}
        rider={selectedRider}
      />
    </Dialog>
  );
};

export default PendingRidersDialog;
