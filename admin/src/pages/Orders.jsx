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

const OrderManagement = ({token}) => {
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
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`
      );
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
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
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/serviceRequests`, {
      headers: { token },
    });
    const data = response.data.data;
    
    // Better logging options:
    console.log('Service Requests:', data); // Option 1: Direct logging
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
        `${import.meta.env.VITE_BACKEND_URL}/api/riders`
      );
      if (!response.ok) throw new Error("Failed to fetch riders");
      const data = await response.json();
      setRiders(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, riders: false }));
    }
  };

  // Assign rider to service request
  const handleRiderAssignment = async (requestId, riderId) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/service-requests/${requestId}/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ riderId }),
        }
      );

      if (!response.ok) throw new Error("Failed to assign rider");

      // Refresh service requests to get updated data
      await fetchServiceRequests();

      toast.success("Rider assigned successfully");
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
    //fetchOrders();
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
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.userId}</TableCell>
                      <TableCell>${order.totalAmount}</TableCell>
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
                  {serviceRequests.map((service) => (
                    <TableRow key={service._id}>
                      <TableCell>{service._id}</TableCell>
                      <TableCell>{service.service.name}</TableCell>
                      {/*<TableCell>{service.user.name}</TableCell>*/}
                      <TableCell>
                        <Badge className={getStatusBadgeColor(service.status)}>
                          {service.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(service.scheduledFor).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={service.assignedRider || ""}
                          onValueChange={(value) =>
                            handleRiderAssignment(service._id, value)
                          }
                        >
                          {/*<SelectTrigger className="w-40">
                            <SelectValue placeholder="Assign rider" />
                          </SelectTrigger>
                          <SelectContent>
                            {riders.map((rider) => (
                              <SelectItem key={rider._id} value={rider._id}>
                                {rider.name}
                              </SelectItem>
                            ))}
                          </SelectContent>*/}
                        </Select>
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
