import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import OrderDetailsDialog from '@/components/OrderDetailsDialog';
import ServiceDetailsDialog from '@/components/ServiceDetailsDialog';

const OrderManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data - replace with actual API calls
  const orders = [
    {
      id: '1',
      userId: 'user123',
      totalAmount: 299.99,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      products: [
        { product: { name: 'Product 1' }, quantity: 2, price: 149.99 }
      ],
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      }
    }
  ];

  const serviceRequests = [
    {
      id: '1',
      user: 'user456',
      service: { name: 'Repair Service' },
      status: 'CREATED',
      price: 99.99,
      scheduledFor: new Date().toISOString(),
      userLocation: {
        address: '456 Service Ave, Boston, MA 02101'
      }
    }
  ];

  const getStatusBadgeColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ORDERED: 'bg-blue-100 text-blue-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CREATED: 'bg-purple-100 text-purple-800',
      ASSIGNED: 'bg-indigo-100 text-indigo-800',
      IN_PROGRESS: 'bg-orange-100 text-orange-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto py-10">
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
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceRequests.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.id}</TableCell>
                      <TableCell>{service.service.name}</TableCell>
                      <TableCell>{service.user}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(service.status)}>
                          {service.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(service.scheduledFor).toLocaleDateString()}</TableCell>
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