/*
//fghj
import React, { useState } from 'react';
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
import {
  Card,
  CardContent,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Timer,
  Tool,
} from 'lucide-react';

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    timeframe: "all",
    serviceType: "all"
  });

  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customerName: "John Doe",
      serviceType: "AC Installation",
      date: "2024-12-19",
      time: "10:00 AM",
      status: "pending",
      phone: "+91 9876543210",
      email: "john@example.com",
      address: "123 Main St, City",
      amount: 2500,
      technicianAssigned: "Mike Smith",
      priority: "high",
      notes: "Customer requested quick service",
      paymentStatus: "paid",
      serviceDetails: {
        description: "Split AC Installation",
        duration: "2-3 hours",
        requirements: ["Mounting bracket", "Copper pipes", "Drainage pipe"]
      }
    },
    {
      id: "ORD002",
      customerName: "Jane Smith",
      serviceType: "Refrigerator Repair",
      date: "2024-12-19",
      time: "2:00 PM",
      status: "in-progress",
      phone: "+91 9876543211",
      email: "jane@example.com",
      address: "456 Oak St, City",
      amount: 1200,
      technicianAssigned: "Bob Wilson",
      priority: "medium",
      notes: "Not cooling properly",
      paymentStatus: "pending",
      serviceDetails: {
        description: "Cooling system repair",
        duration: "1-2 hours",
        requirements: ["Repair kit", "Coolant"]
      }
    }
  ]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: <Timer className="h-4 w-4 mr-1" /> },
      "in-progress": { color: "bg-blue-100 text-blue-800", icon: <Tool className="h-4 w-4 mr-1" /> },
      completed: { color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-4 w-4 mr-1" /> },
      cancelled: { color: "bg-red-100 text-red-800", icon: <XCircle className="h-4 w-4 mr-1" /> }
    };

    return (
      <div className={`flex items-center px-2 py-1 rounded-full text-xs ${statusStyles[status].color}`}>
        {statusStyles[status].icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const OrderDetails = ({ order }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-4">Customer Information</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              {order.customerName}
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
              {order.phone}
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              {order.email}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              {order.address}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Service Information</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Tool className="h-4 w-4 mr-2 text-gray-500" />
              {order.serviceType}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              {order.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              {order.time}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Service Details</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm mb-2">{order.serviceDetails.description}</p>
          <p className="text-sm text-gray-600">Duration: {order.serviceDetails.duration}</p>
          <div className="mt-2">
            <p className="text-sm font-medium">Requirements:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {order.serviceDetails.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Payment Information</h3>
          <div className="space-y-1">
            <p className="text-sm">Amount: ₹{order.amount}</p>
            <p className="text-sm">Status: 
              <Badge className={`ml-2 ${
                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.paymentStatus.toUpperCase()}
              </Badge>
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Assignment Details</h3>
          <div className="space-y-1">
            <p className="text-sm">Technician: {order.technicianAssigned}</p>
            <p className="text-sm">Priority: 
              <Badge className={`ml-2 ${
                order.priority === 'high' ? 'bg-red-100 text-red-800' : 
                order.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-blue-100 text-blue-800'
              }`}>
                {order.priority.toUpperCase()}
              </Badge>
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Notes</h3>
        <p className="text-sm text-gray-600">{order.notes}</p>
      </div>

      <div className="flex space-x-3 pt-4">
        <Select
          value={order.status}
          onValueChange={(value) => handleStatusChange(order.id, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Update Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
          Close
        </Button>
      </div>
    </div>
  );

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === "all" || order.status === filters.status;
    const matchesService = filters.serviceType === "all" || order.serviceType === filters.serviceType;

    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Order Management</CardTitle>
          <div className="flex space-x-4">
            <div className="flex items-center border rounded-md px-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search orders..."
                className="border-0 focus:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <div className="px-6 py-4 border-b flex space-x-4">
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({...filters, status: value})}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.serviceType}
            onValueChange={(value) => setFilters({...filters, serviceType: value})}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="AC Installation">AC Installation</SelectItem>
              <SelectItem value="Refrigerator Repair">Refrigerator Repair</SelectItem>
              <SelectItem value="Microwave Repair">Microwave Repair</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.serviceType}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.date}</div>
                      <div className="text-sm text-gray-500">{order.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <Badge className={`${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus.toUpperCase()}
                    </Badge>
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
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;*/

import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const OrderManagement = ({ token }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {

      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }


  }

  const statusHandler = async ( event, orderId ) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status' , {orderId, status:event.target.value}, { headers: {token}})
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(response.data.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> </p>
                    }
                    else {
                      return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> ,</p>
                    }
                  })}
                </div>
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                <p className='mt-3'>Method : {order.paymentMethod}</p>
                <p>Payment : { order.payment ? 'Done' : 'Pending' }</p>
                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className='p-2 font-semibold'>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default OrderManagement;