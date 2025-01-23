import { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  User,
  MapPin,
  Search,
  Phone,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderDetailsDialog from "@/components/OrderDetailsDialog";
import ServiceDetailsDialog from "@/components/ServiceDetailsDialog";
import { toast } from "react-toastify";
//import RiderAssignmentCell from "@/components/RiderAssignmentCell";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RiderAssignmentCell from "../components/RiderAssignmentCell";
import ExportButtons from "../components/OrderExportButtons";
import RiderLocationTracker from "../components/RiderLocationTracker";
import ProductOrderChalan from "../components/ProductOrderChalan";

const ITEMS_PER_PAGE = 5;

const ORDER_STATUSES = ["PENDING", "ORDERED", "DELIVERED", "CANCELLED"];
const SERVICE_STATUSES = [
  "CREATED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

{
  /* Add this helper function outside your component */
}
const calculateTotalAmount = (service) => {
  // Base service price
  const basePrice = service.service?.price || 0;

  // Sum of additional work prices
  const additionalWorkTotal =
    service?.addedWorks
      ?.filter((work) => work.approved === true)
      .reduce((sum, work) => sum + (work.price || 0), 0) || 0;

  return basePrice + additionalWorkTotal;
};

const OrderManagement = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState({
    orders: false,
    services: false,
    riders: false,
  });

  // Pagination states
  const [orderPage, setOrderPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);

  // Search and filter states
  const [orderSearch, setOrderSearch] = useState("");
  const [filterOrderDate, setFilterOrderDate] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  //Add these new state variables after the existing state declarations
  const [filterRequestedDate, setFilterRequestedDate] = useState("");
  const [filterScheduledDate, setFilterScheduledDate] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [serviceStatusFilter, setServiceStatusFilter] = useState("all");

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const handleViewProfile = () => {
    setIsProfileOpen(true);
  };

  const handleTrackLocation = () => {
    setIsLocationOpen(true);
  };

  // Reset pagination when search/filters change
  useEffect(() => {
    setOrderPage(1);
  }, [orderSearch, orderStatusFilter, filterOrderDate]);

  useEffect(() => {
    setServicePage(1);
  }, [
    serviceSearch,
    serviceStatusFilter,
    filterRequestedDate,
    filterScheduledDate,
  ]);

  // Filter functions
  const filterOrders = (orders) => {
    return orders.filter((order) => {
      const matchesSearch =
        order.userId.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order._id.toLowerCase().includes(orderSearch.toLowerCase());

      const matchesStatus =
        orderStatusFilter === "all" || order.status === orderStatusFilter;

      // Add single date filtering logic
      const orderDate = new Date(order.createdAt).toLocaleDateString();
      const selectedDate = filterOrderDate
        ? new Date(filterOrderDate).toLocaleDateString()
        : null;

      const matchesDate = !selectedDate || orderDate === selectedDate;

      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const filterServices = (services) => {
    return services.filter((service) => {
      const matchesSearch =
        service.user.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        service._id.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        (service.service?.name || "")
          .toLowerCase()
          .includes(serviceSearch.toLowerCase());

      const matchesStatus =
        serviceStatusFilter === "all" || service.status === serviceStatusFilter;

      // Add date filtering logic
      const requestedDate = new Date(service.createdAt).toLocaleDateString();
      const scheduledDate = new Date(service.scheduledFor).toLocaleDateString();

      const selectedRequestedDate = filterRequestedDate
        ? new Date(filterRequestedDate).toLocaleDateString()
        : null;
      const selectedScheduledDate = filterScheduledDate
        ? new Date(filterScheduledDate).toLocaleDateString()
        : null;

      const matchesRequestedDate =
        !selectedRequestedDate || requestedDate === selectedRequestedDate;
      const matchesScheduledDate =
        !selectedScheduledDate || scheduledDate === selectedScheduledDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRequestedDate &&
        matchesScheduledDate
      );
    });
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading((prev) => ({ ...prev, orders: true }));
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/list`,
        {
          method: "POST",
          headers: { token },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      const sortedOrders = data.orders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
      console.log("orders: ", sortedOrders);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  // Fetch service requests
  const fetchServiceRequests = async () => {
    try {
      setLoading((prev) => ({ ...prev, services: true }));
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/serviceRequests`,
        {
          headers: { token },
        }
      );
      const data = response.data.data;

      // Better logging options:
      console.log("Service Requests:", data); // Option 1: Direct logging
      setServiceRequests(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, services: false }));
    }
  };

  // Fetch riders
  const fetchRiders = async () => {
    try {
      setLoading((prev) => ({ ...prev, riders: true }));
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/riders/list`,
        {
          headers: { token },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch riders");
      const data = await response.json();
      console.log("Riders:", data.data);
      setRiders(data.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, riders: false }));
    }
  };

  // Assign rider to service request
  const handleRiderAssignment = async (requestId, riderId) => {
    console.log("Assigning rider to service request: ", requestId, riderId);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/serviceRequests/${requestId}/assign-rider`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ riderId }),
        }
      );

      const data = await response.json();
      console.log("assigned service request: ", data);

      if (!response.ok) throw new Error("Failed to assign rider");

      // Refresh service requests to get updated data
      await fetchServiceRequests();

      if (response.ok) toast.success("Rider assigned successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Update service request status
  const updateServiceStatus = async (requestId, status) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/service-requests/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      // Refresh service requests to get updated data
      await fetchServiceRequests();
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get paginated and filtered data
  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  const filteredOrders = filterOrders(orders);
  const filteredServices = filterServices(serviceRequests);
  const currentOrders = getPaginatedData(filteredOrders, orderPage);
  const currentServices = getPaginatedData(filteredServices, servicePage);

  const getTotalPages = (data) => Math.ceil(data.length / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchOrders();
    fetchServiceRequests();
    fetchRiders();
  }, []);

  const getStatusBadgeColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      ORDERED: "bg-blue-100 text-blue-800",
      DELIVERED: "bg-green-100 text-green-800",
      CREATED: "bg-purple-100 text-purple-800",
      ASSIGNED: "bg-indigo-100 text-indigo-800",
      IN_PROGRESS: "bg-orange-100 text-orange-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Product Orders</TabsTrigger>
          <TabsTrigger value="services">Service Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                {/* Title Section */}
                <div>
                  <CardTitle>Product Orders</CardTitle>
                  <CardDescription>Manage all product orders</CardDescription>
                </div>

                {/* Filters Section */}
                <div className="flex flex-col space-y-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:space-y-0">
                  {/* Export Button */}
                  <div className="w-full sm:w-auto">
                    <ExportButtons data={currentOrders} type="orders" />
                  </div>

                  {/* Search Input */}
                  <div className="flex items-center border rounded-md px-2 w-full sm:w-auto sm:min-w-[200px]">
                    <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <Input
                      placeholder="Search orders..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="border-0 focus:ring-0"
                    />
                  </div>

                  {/* Date Filter */}
                  <div className="w-full sm:w-auto">
                    <Input
                      type="date"
                      value={filterOrderDate}
                      onChange={(e) => setFilterOrderDate(e.target.value)}
                      className="w-full sm:w-40"
                      placeholder="Filter by date"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="w-full sm:w-auto">
                    <Select
                      value={orderStatusFilter}
                      onValueChange={setOrderStatusFilter}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID / Product</TableHead>
                    <TableHead>Brand / Model</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <div className="space-y-4">
                          {order.products.map((item) => (
                            <div
                              key={item._id}
                              className="border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                            >
                              <div className="font-medium text-gray-900">
                                {item.product?.name}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mb-2 text-sm font-medium text-gray-600">
                          Order ID: {order._id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-4">
                          {order.products.map((item) => (
                            <div key={item._id}>
                              <div className="font-medium">
                                {item.product?.brand}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.product?.model}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.seller ? order.seller.name : "Admin"}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.userId.name}</div>
                        <div className="text-sm text-gray-500">
                          {order.userId.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        ₹
                        {order.products
                          .reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <OrderDetailsDialog order={order} />
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Dialog>
                                <DialogTrigger asChild>
                                  <div className="flex items-center">
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Chalan
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                  <ProductOrderChalan order={order} />
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                currentPage={orderPage}
                totalPages={getTotalPages(orders)}
                onPageChange={setOrderPage}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                {/* Title Section */}
                <div className="mb-4 lg:mb-0">
                  <CardTitle>Service Requests</CardTitle>
                  <CardDescription>Manage all service requests</CardDescription>
                </div>

                {/* Filters Section */}
                <div className="flex flex-col space-y-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-3 sm:space-y-0">
                  {/* Export Button */}
                  <div className="w-full sm:w-auto">
                    <ExportButtons data={currentServices} type="services" />
                  </div>

                  {/* Search Input */}
                  <div className="flex items-center border rounded-md px-2 w-full sm:w-auto sm:min-w-[200px]">
                    <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <Input
                      placeholder="Search services..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="border-0 focus:ring-0"
                    />
                  </div>

                  {/* Date Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        Requested On
                      </span>
                      <Input
                        type="date"
                        value={filterRequestedDate}
                        onChange={(e) => setFilterRequestedDate(e.target.value)}
                        className="w-full sm:w-40"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        Scheduled For
                      </span>
                      <Input
                        type="date"
                        value={filterScheduledDate}
                        onChange={(e) => setFilterScheduledDate(e.target.value)}
                        className="w-full sm:w-40"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="w-full sm:w-auto">
                    <Select
                      value={serviceStatusFilter}
                      onValueChange={setServiceStatusFilter}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {SERVICE_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service/Request ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested On</TableHead>
                    <TableHead>Scheduled For</TableHead>
                    <TableHead>Assign Rider</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(currentServices) &&
                    currentServices.map((service) => (
                      <TableRow key={service._id}>
                        <TableCell>
                          <div className="font-medium">
                            {service.service?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {service._id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {service.user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {service.user.email}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              ₹{calculateTotalAmount(service)}
                            </div>
                            {service.addedWorks &&
                              service.addedWorks.length > 0 && (
                                <div className="text-xs text-gray-500">
                                  Base: ₹{service.service?.price || 0}
                                  <br />
                                  Additional: ₹
                                  {service.addedWorks
                                    .filter((work) => work.approved == true)
                                    .reduce(
                                      (sum, work) => sum + (work.price || 0),
                                      0
                                    )}
                                </div>
                              )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={getStatusBadgeColor(service.status)}
                          >
                            {service.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(service.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(service.scheduledFor).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          {service.rider ? (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {service.rider.firstName +
                                  " " +
                                  service.rider.lastName}
                              </span>
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {service.rider.phoneNumber}
                              </span>
                            </div>
                          ) : (
                            <RiderAssignmentCell
                              service={service}
                              riders={riders}
                              handleRiderAssignment={handleRiderAssignment}
                            />
                          )}
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <ServiceDetailsDialog service={service} />
                              <DropdownMenuItem
                                onClick={handleTrackLocation}
                                className="cursor-pointer"
                              >
                                <MapPin className="mr-2 h-4 w-4" />
                                <span>Track Location</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {/* Profile Details Dialog */}
                          <Dialog
                            open={isProfileOpen}
                            onOpenChange={setIsProfileOpen}
                          >
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Profile Details</DialogTitle>
                              </DialogHeader>
                              {/* Add your profile details content here */}
                            </DialogContent>
                          </Dialog>

                          {/* Location Tracking Dialog */}
                          <Dialog
                            open={isLocationOpen}
                            onOpenChange={setIsLocationOpen}
                          >
                            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Location Tracking</DialogTitle>
                              </DialogHeader>
                              {service && (
                                <RiderLocationTracker
                                  riderId={service.rider?._id}
                                  riderName={`${service.rider?.firstName} ${service.rider?.lastName}`}
                                  phoneNumber={service.rider?.phoneNumber}
                                  serviceId={service._id}
                                  customerAddress={service.address}
                                  startTime={service.startTime}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <Pagination
                currentPage={servicePage}
                totalPages={getTotalPages(serviceRequests)}
                onPageChange={setServicePage}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderManagement;
