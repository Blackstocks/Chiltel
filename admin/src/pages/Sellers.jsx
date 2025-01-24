import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  Building2,
  FileCheck,
  Store,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Receipt,
  Search,
  Filter,
  User,
  Pencil,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import SellerPayrollDialog from "@/components/SellerPayrollDialog";
import ExportButtons from "../components/SellerExportButton";

const SellerDetails = ({ seller, onClose }) => {
  if (!seller) return null;

  return (
    <Sheet open={!!seller} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="mb-4">
          <SheetTitle>Seller Details</SheetTitle>
          <SheetDescription>
            Complete information about the seller
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] pr-4">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                <Store className="h-4 w-4" />
                Store Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-gray-500">Shop Name</label>
                  <p className="font-medium">{seller.shopName}</p>
                </div>
                <div>
                  <label className="text-gray-500">Proprietor Name</label>
                  <p className="font-medium">{seller.proprietorName}</p>
                </div>
                <div>
                  <label className="text-gray-500">Registration Status</label>
                  <div className="mt-1">
                    {getStatusBadge(seller.registrationStatus)}
                  </div>
                </div>
                <div>
                  <label className="text-gray-500">Commission Rate</label>
                  <p className="font-medium">{seller.commissionRate || 0}%</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                <Phone className="h-4 w-4" />
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-gray-500">Email</label>
                  <p className="font-medium">{seller.email}</p>
                </div>
                <div>
                  <label className="text-gray-500">Phone Number</label>
                  <p className="font-medium">{seller.phoneNumber}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Registered Address */}
            <div>
              <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4" />
                Registered Address
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{seller.registeredAddress.street}</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-gray-500">City</label>
                    <p className="font-medium">
                      {seller.registeredAddress.city}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">State</label>
                    <p className="font-medium">
                      {seller.registeredAddress.state}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">Pincode</label>
                    <p className="font-medium">
                      {seller.registeredAddress.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warehouse Address */}
            <div>
              <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4" />
                Warehouse Address
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{seller.warehouseAddress.street}</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-gray-500">City</label>
                    <p className="font-medium">
                      {seller.warehouseAddress.city}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">State</label>
                    <p className="font-medium">
                      {seller.warehouseAddress.state}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">Pincode</label>
                    <p className="font-medium">
                      {seller.warehouseAddress.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank & GST Details */}
            {(seller.bankDetails || seller.gstNumber) && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                    <Receipt className="h-4 w-4" />
                    Bank & Tax Details
                  </h3>
                  <div className="space-y-4 text-sm">
                    {seller.gstNumber && (
                      <div>
                        <label className="text-gray-500">GST Number</label>
                        <p className="font-medium">{seller.gstNumber}</p>
                      </div>
                    )}
                    {seller.bankDetails && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-gray-500">Bank Name</label>
                          <p className="font-medium">
                            {seller.bankDetails.bankName}
                          </p>
                        </div>
                        <div>
                          <label className="text-gray-500">
                            Account Number
                          </label>
                          <p className="font-medium">
                            {seller.bankDetails.accountNumber}
                          </p>
                        </div>
                        <div>
                          <label className="text-gray-500">IFSC Code</label>
                          <p className="font-medium">
                            {seller.bankDetails.ifscCode}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Documents */}
            {seller.dealerCertificate && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                    <FileCheck className="h-4 w-4" />
                    Documents
                  </h3>
                  <div className="text-sm">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-green-500" />
                        <span>Dealer Certificate</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

const getStatusBadge = (status) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
    approved: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    rejected: { color: "bg-red-100 text-red-700", icon: XCircle },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} px-2 py-1 rounded-full`}>
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch] = useDebounce(search, 500);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [isPayrollDialogOpen, setIsPayrollDialogOpen] = useState(false);
  const [selectedSellerForPayroll, setSelectedSellerForPayroll] =
    useState(null);

  const handleOpenPayrollDialog = (seller) => {
    setSelectedSellerForPayroll(seller);
    setIsPayrollDialogOpen(true);
  };

  const handlePayrollUpdate = async (commission) => {
    // Update the local state immediately
    setSellers(
      sellers.map((s) =>
        s._id === selectedSellerForPayroll._id
          ? { ...s, commissionRate: commission } // Update commissionRate instead of payroll.commission
          : s
      )
    );
    //await fetchSellers(); // Fetch fresh data from the server
  };

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 6,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(status !== "all" && { status }),
      });

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/list?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      console.log("Sellers data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch sellers");
      }

      setSellers(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (sellerId, action) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/${action}/${sellerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${action}ing seller`);
      }

      toast.success(data.message);
      fetchSellers(); // Refresh the list
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openConfirmDialog = (seller, action) => {
    setSelectedSeller(seller);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    await handleStatusUpdate(selectedSeller._id, actionType);
    setShowConfirmDialog(false);
    setSelectedSeller(null);
    setActionType(null);
  };

  const handleViewDetails = (seller) => {
    setSelectedSeller(seller);
  };

  const renderActionButtons = (seller) => {
    if (seller.registrationStatus === "pending") {
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
            onClick={() => openConfirmDialog(seller, "approve")}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
            onClick={() => openConfirmDialog(seller, "reject")}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      );
    }

    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleViewDetails(seller)}
      >
        View Details
      </Button>
    );
  };

  useEffect(() => {
    fetchSellers();
  }, [debouncedSearch, status, currentPage]);

  return (
    <div className="">
      <Card className="w-full">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Sellers Management
            </CardTitle>
            <div className="flex items-center gap-3">
              <ExportButtons data={sellers}/>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sellers..."
                  className="pl-8 w-[250px] h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px] h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="p-6 pt-0 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead>Shop Details</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payroll</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellers?.map((seller) => (
                  <TableRow key={seller._id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4" />
                          <span className="font-medium">{seller.shopName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User className="h-4 w-4" />
                          <span>{seller.proprietorName}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{seller.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{seller.phoneNumber}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1" />
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">
                            {seller.registeredAddress.city},{" "}
                            {seller.registeredAddress.state}
                          </span>
                          <span className="text-xs text-gray-500">
                            Pin: {seller.registeredAddress.pincode}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(seller.registrationStatus)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {seller?.commissionRate || 0}% Commission
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenPayrollDialog(seller)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell>{renderActionButtons(seller)}</TableCell>
                  </TableRow>
                ))}

                {sellers?.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No sellers found
                    </TableCell>
                  </TableRow>
                )}

                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading sellers...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Seller
              Registration
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} the registration for{" "}
              <span className="font-medium">{selectedSeller?.shopName}</span>?
              {actionType === "reject" && (
                <p className="mt-2 text-red-600">
                  This action will prevent the seller from accessing the
                  platform.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={
                actionType === "approve" ? "bg-green-600" : "bg-red-600"
              }
              onClick={handleConfirm}
            >
              {actionType === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details Sheet */}
      <SellerDetails
        seller={selectedSeller}
        onClose={() => setSelectedSeller(null)}
      />

      {/* Payroll Dialog */}
      <SellerPayrollDialog
        seller={selectedSellerForPayroll}
        isOpen={isPayrollDialogOpen}
        onClose={() => {
          setIsPayrollDialogOpen(false);
          setSelectedSellerForPayroll(null);
        }}
        onSave={handlePayrollUpdate}
      />
    </div>
  );
};

export default Sellers;
