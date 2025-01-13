import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const OrderDetailsSheet = ({ order }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-200 text-yellow-800";
      case "ORDERED":
        return "bg-blue-200 text-blue-800";
      case "DELIVERED":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">View Order Details</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Order Details</SheetTitle>
          <SheetDescription>Order ID: {order._id}</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Name: {order.userId.name}</p>
                <p className="text-sm">Email: {order.userId.email}</p>
                <div className="pt-2">
                  <p className="font-medium text-sm">Shipping Address:</p>
                  <p className="text-sm">{order.address.street}</p>
                  <p className="text-sm">
                    {order.address.city}, {order.address.state}{" "}
                    {order.address.zipCode}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm">
                  Order Date: {formatDate(order.createdAt)}
                </p>
                <p className="text-sm">
                  Payment Method: {order.paymentDetails.method}
                </p>
                <p className="text-sm">
                  Transaction ID: {order.paymentDetails.transactionId}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.products.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium">
                        <div className="font-medium">{item.product?.name}</div>
                        <div className="text-sm text-gray-500">
                          {item.product?._id}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total Amount:
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ₹{order.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSheet;
