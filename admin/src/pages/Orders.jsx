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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import RiderAssignmentCell from "../components/RiderAssignmentCell";

const ITEMS_PER_PAGE = 6;

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
    service.addedWorks?.reduce((sum, work) => sum + (work.price || 0), 0) || 0;

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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Product Orders</CardTitle>
                  <CardDescription>Manage all product orders</CardDescription>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center border rounded-md px-2">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search orders..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="border-0 focus:ring-0"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={filterOrderDate}
                      onChange={(e) => setFilterOrderDate(e.target.value)}
                      className="w-40"
                      placeholder="Filter by date"
                    />
                  </div>

                  <Select
                    value={orderStatusFilter}
                    onValueChange={setOrderStatusFilter}
                  >
                    <SelectTrigger className="w-[180px]">
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
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
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
                      <TableCell>{order._id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{order.userId.name}</div>
                        <div className="text-sm text-gray-500">
                          {order.userId.email}
                        </div>
                      </TableCell>
                      <TableCell>₹{order.totalAmount}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <OrderDetailsDialog order={order} />
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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Service Requests</CardTitle>
                  <CardDescription>Manage all service requests</CardDescription>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div className="flex items-center border rounded-md px-2">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search services..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="border-0 focus:ring-0"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        Requested On
                      </span>
                      <Input
                        type="date"
                        value={filterRequestedDate}
                        onChange={(e) => setFilterRequestedDate(e.target.value)}
                        className="w-40"
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
                        className="w-40"
                      />
                    </div>
                  </div>

                  <Select
                    value={serviceStatusFilter}
                    onValueChange={setServiceStatusFilter}
                  >
                    <SelectTrigger className="w-[180px]">
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
                                  {service.addedWorks.reduce(
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

                        {/*<TableCell>
                          <div className="space-y-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  {service.assignedRider
                                    ? "Reassign Rider"
                                    : "Assign Rider"}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>
                                    {service.assignedRider
                                      ? "Reassign Rider"
                                      : "Assign Rider"}
                                  </DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="max-h-[400px] pr-4">
                                  <div className="space-y-2">
                                    {Array.isArray(riders) &&
                                    riders.filter(
                                      (rider) =>
                                        service.service &&
                                        rider.specializations.includes(
                                          service.service.product
                                        )
                                    ).length > 0 ? (
                                      riders
                                        .filter(
                                          (rider) =>
                                            service.service &&
                                            rider.specializations.includes(
                                              service.service.product
                                            )
                                        )
                                        .map((rider) => (
                                          <Card
                                            key={rider._id}
                                            className={`cursor-pointer hover:bg-accent transition-colors ${
                                              service.assignedRider ===
                                              rider._id
                                                ? "border-primary"
                                                : ""
                                            }`}
                                            onClick={() => {
                                              handleRiderAssignment(
                                                service._id,
                                                rider._id
                                              );
                                            }}
                                          >
                                            <CardContent className="p-4">
                                              <div className="flex items-center justify-between">
                                                <div>
                                                  <p className="font-medium">
                                                    {`${rider.firstName} ${rider.lastName}`}
                                                  </p>
                                                  <p className="text-sm text-muted-foreground">
                                                    <div className="flex flex-wrap gap-1">
                                                      {rider.specializations.map(
                                                        (spec, index) => (
                                                          <span
                                                            key={index}
                                                            className={`text-xs px-2 py-0.5 rounded-full ${
                                                              spec ===
                                                              service.service
                                                                .product
                                                                ? "bg-primary/10 text-primary"
                                                                : "bg-secondary/50 text-secondary-foreground"
                                                            }`}
                                                          >
                                                            {spec}
                                                          </span>
                                                        )
                                                      )}
                                                    </div>
                                                  </p>
                                                </div>
                                                <div className="text-sm">
                                                  {rider?.rating?.average?.toFixed(
                                                    1
                                                  ) || "0.0"}
                                                  ★
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))
                                    ) : (
                                      <p>
                                        No rider with the specialization found
                                      </p>
                                    )}
                                  </div>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>

                            {service.assignedRider && (
                              <Badge variant="outline">
                                Currently Assigned:{" "}
                                {riders.find(
                                  (r) => r._id === service.assignedRider
                                )
                                  ? `${
                                      riders.find(
                                        (r) => r._id === service.assignedRider
                                      ).firstName
                                    } ${
                                      riders.find(
                                        (r) => r._id === service.assignedRider
                                      ).lastName
                                    }`
                                  : ""}
                              </Badge>
                            )}
                          </div>
                        </TableCell>*/}

                        <TableCell>
                          <RiderAssignmentCell
                            service={service}
                            riders={riders}
                            handleRiderAssignment={handleRiderAssignment}
                          />
                        </TableCell>

                        <TableCell>
                          <ServiceDetailsDialog service={service} />
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
