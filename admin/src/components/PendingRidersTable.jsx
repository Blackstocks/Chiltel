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
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const PendingRidersDialog = ({ onRiderApproved }) => {
  const [pendingRiders, setPendingRiders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleApproveRider(rider._id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleRejectRider(rider._id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PendingRidersDialog;