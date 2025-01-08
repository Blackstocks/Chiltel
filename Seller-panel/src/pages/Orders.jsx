import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Clock,
  MapPin,
  CreditCard,
  CircleDollarSign,
  Truck,
  Info,
  CalendarDays,
} from "lucide-react";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/getSellerOrders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrders(response.data.data);
      console.log("seller orders: ", response.data.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      ORDERED: "bg-blue-100 text-blue-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const OrderDetailsSheet = ({ order, open, onClose }) => {
    if (!order) return null;

    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader className="mb-4">
            <SheetTitle>Order Details</SheetTitle>
            <SheetDescription>Order #{order._id.slice(-8)}</SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-100px)] pr-4">
            <div className="space-y-6">
              {/* Order Status */}
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4" />
                  Order Status
                </h3>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>

              <Separator />

              {/* Order Type & Date */}
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <CalendarDays className="h-4 w-4" />
                  Order Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-500">Order Type</label>
                    <p className="font-medium capitalize">{order.orderType}</p>
                  </div>
                  <div>
                    <label className="text-gray-500">Order Date</label>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products */}
              {order.products && order.products.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                      <Package className="h-4 w-4" />
                      Products
                    </h3>
                    <div className="space-y-3">
                      {order.products.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity} × ₹{item.price}
                              </p>
                            </div>
                            <p className="font-medium">
                              ₹{(item.quantity * item.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Services */}
              {order.services && order.services.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                      <Truck className="h-4 w-4" />
                      Services
                    </h3>
                    <div className="space-y-3">
                      {order.services.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{item.service.name}</p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity} × ₹{item.price}
                              </p>
                            </div>
                            <p className="font-medium">
                              ₹{(item.quantity * item.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Payment Details */}
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <CreditCard className="h-4 w-4" />
                  Payment Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="font-medium">
                      {order.paymentDetails.method}
                    </span>
                  </div>
                  {order.paymentDetails.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transaction ID</span>
                      <span className="font-medium">
                        {order.paymentDetails.transactionId}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-medium pt-2">
                    <span>Total Amount</span>
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="font-medium">{order.address.street}</p>
                  <p className="text-gray-500">
                    {order.address.city}, {order.address.state}
                  </p>
                  <p className="text-gray-500">{order.address.zipCode}</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircleDollarSign className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
        <div>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage and track all orders</CardDescription>
        </div>
        </CardHeader>
        <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>#{order._id.slice(-8)}</TableCell>
                  <TableCell className="capitalize">
                    {order.products.map((product, index) => (
                      <div key={index}>
                        <div className="font-medium">
                          {product.product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.product._id}
                        </div>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.userId.name}</div>
                      <div className="text-sm text-gray-500">
                        {order.userId.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </CardContent>

        <OrderDetailsSheet
          order={selectedOrder}
          open={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedOrder(null);
          }}
        />
      </Card>
    </div>
  );
};

export default OrdersPage;
