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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 5;
const ORDER_STATUSES = ["ALL", "PENDING", "ORDERED", "DELIVERED", "CANCELLED"];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...orders];

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order._id.toLowerCase().includes(searchLower) ||
          order.userId.name.toLowerCase().includes(searchLower) ||
          order.userId.email.toLowerCase().includes(searchLower) ||
          order.products.some((p) =>
            p.product.name.toLowerCase().includes(searchLower)
          )
      );
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== "ALL") {
      const today = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "TODAY":
          result = result.filter(
            (order) =>
              new Date(order.createdAt).toDateString() === today.toDateString()
          );
          break;
        case "WEEK":
          filterDate.setDate(today.getDate() - 7);
          result = result.filter(
            (order) => new Date(order.createdAt) >= filterDate
          );
          break;
        case "MONTH":
          filterDate.setMonth(today.getMonth() - 1);
          result = result.filter(
            (order) => new Date(order.createdAt) >= filterDate
          );
          break;
      }
    }

    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, dateFilter, orders]);

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const Pagination = () => (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-sm text-gray-700">
        Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)}{" "}
        of {filteredOrders.length} entries
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const FilterBar = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "ALL" ? "All Status" : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Time</SelectItem>
            <SelectItem value="TODAY">Today</SelectItem>
            <SelectItem value="WEEK">Last 7 Days</SelectItem>
            <SelectItem value="MONTH">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        onClick={() => {
          setSearchTerm("");
          setStatusFilter("ALL");
          setDateFilter("ALL");
        }}
      >
        Clear Filters
      </Button>
    </div>
  );

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
                    <span>₹{order.sellerTotal.toLocaleString()}</span>
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
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <CircleDollarSign className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <FilterBar />
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
                    {currentOrders.map((order) => (
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
                            <div className="font-medium">
                              {order.userId.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.userId.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          ₹{order.sellerTotal.toLocaleString()}
                        </TableCell>
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
              <Pagination />
            </>
          )}
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
