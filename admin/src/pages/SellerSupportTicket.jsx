import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, MoreVertical, Mail } from "lucide-react";

const SellerSupportTickets = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Example tickets data
  const tickets = [
    {
      id: "TCK-001",
      subject: "Payment Delay",
      description: "Payment for order #12345 has been delayed for 3 days.",
      category: "Payment",
      status: "open",
      priority: "high",
      sellerName: "John's Store",
      sellerId: "SLR-123",
      created: "2024-01-05",
      lastUpdate: "2024-01-06",
      responses: [
        {
          message: "We're looking into this issue.",
          from: "admin",
          timestamp: "2024-01-06 10:30 AM"
        }
      ]
    },
    {
      id: "TCK-002",
      subject: "Product Listing Issue",
      description: "Unable to list new products on the store.",
      category: "Product",
      status: "pending",
      priority: "medium",
      sellerName: "Alice's Boutique",
      sellerId: "SLR-456",
      created: "2024-01-04",
      lastUpdate: "2024-01-05",
      responses: [
        {
          message: "Please provide more details about the issue.",
          from: "admin",
          timestamp: "2024-01-05 09:15 AM"
        }
      ]
    },
    {
      id: "TCK-003",
      subject: "Order Cancellation",
      description: "Request to cancel order #67890.",
      category: "Order",
      status: "resolved",
      priority: "low",
      sellerName: "Bob's Electronics",
      sellerId: "SLR-789",
      created: "2024-01-03",
      lastUpdate: "2024-01-04",
      responses: [
        {
          message: "Order has been successfully canceled.",
          from: "admin",
          timestamp: "2024-01-04 11:00 AM"
        }
      ]
    },
    {
      id: "TCK-004",
      subject: "Account Suspension",
      description: "Account has been suspended without any notice.",
      category: "Account",
      status: "closed",
      priority: "high",
      sellerName: "Charlie's Gadgets",
      sellerId: "SLR-012",
      created: "2024-01-02",
      lastUpdate: "2024-01-03",
      responses: [
        {
          message: "Your account was suspended due to policy violations.",
          from: "admin",
          timestamp: "2024-01-03 02:45 PM"
        }
      ]
    }
    // Add more ticket examples as needed
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      open: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      closed: "bg-gray-100 text-gray-800",
      resolved: "bg-blue-100 text-blue-800"
    };

    return (
      <Badge variant="secondary" className={statusStyles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityStyles = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-blue-100 text-blue-800"
    };

    return (
      <Badge variant="secondary" className={priorityStyles[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>
                Manage and respond to seller support tickets
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                  icon={<Search className="h-4 w-4" />}
                />
                <Select
                  value={filterStatus}
                  onValueChange={setFilterStatus}
                >
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
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
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="p-0">
                          {ticket.subject}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center justify-between">
                            <span>Ticket Details - {ticket.id}</span>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(ticket.status)}
                              {getPriorityBadge(ticket.priority)}
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div>
                            <h4 className="font-semibold mb-1">Seller Information</h4>
                            <p className="text-sm text-gray-600">{ticket.sellerName}</p>
                            <p className="text-sm text-gray-600">ID: {ticket.sellerId}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">Ticket Information</h4>
                            <p className="text-sm text-gray-600">Category: {ticket.category}</p>
                            <p className="text-sm text-gray-600">Created: {ticket.created}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-sm text-gray-600">{ticket.description}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Responses</h4>
                            <div className="space-y-3">
                              {ticket.responses.map((response, index) => (
                                <div
                                  key={index}
                                  className={`p-3 rounded-lg ${
                                    response.from === "admin"
                                      ? "bg-blue-50 ml-4"
                                      : "bg-gray-50 mr-4"
                                  }`}
                                >
                                  <p className="text-sm">{response.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {response.timestamp}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Reply</h4>
                            <Textarea
                              placeholder="Type your response..."
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>

                        <DialogFooter className="gap-2">
                          <Select defaultValue={ticket.status}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button>Send Response</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>{ticket.sellerName}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{ticket.created}</TableCell>
                  <TableCell>{ticket.lastUpdate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          Mark as Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Escalate Priority
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Close Ticket
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerSupportTickets;