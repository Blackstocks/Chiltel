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

const OrderManagement = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [riders, setRiders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState({
    orders: false,
    services: false,
    riders: false,
  });

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
              <CardTitle>Product Orders</CardTitle>
              <CardDescription>Manage all product orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id}</TableCell>
                      <TableCell>{order.userId.name}</TableCell>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service Requests</CardTitle>
              <CardDescription>Manage all service requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled For</TableHead>
                    <TableHead>Assign Rider</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(serviceRequests) &&
                    serviceRequests.map((service) => (
                      <TableRow key={service._id}>
                        <TableCell>{service._id}</TableCell>
                        {<TableCell>{service.service?.name}</TableCell>}
                        {<TableCell>{service.user.name}</TableCell>}
                        
                        <TableCell>
                          <Badge
                            className={getStatusBadgeColor(service.status)}
                          >
                            {service.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(service.scheduledFor).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
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
                                        rider.specialization ===
                                        service.service.product
                                    ).length > 0 ? (
                                      riders
                                        .filter(
                                          (rider) =>
                                            service.service &&
                                            rider.specialization ===
                                            service.service.product
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
                                                    {rider.specialization}
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
                        </TableCell>
                        <TableCell>
                          <ServiceDetailsDialog service={service} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderManagement;
