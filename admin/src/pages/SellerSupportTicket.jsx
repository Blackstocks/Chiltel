import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
import { MoreVertical, Store, User } from "lucide-react";

const SellerSupportTickets = () => {
  // States
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newResponse, setNewResponse] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        ...(filterStatus !== "all" && { status: filterStatus }),
      });

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets/list?${params}`
      );
      if (data.success) {
        setTickets(data.data.tickets);
        setTotalPages(data.data.pagination.pages);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tickets");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add response
  const handleAddResponse = async (ticketId) => {
    if (!newResponse.trim()) {
      toast.warn("Please enter a response");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}/response`,
        { message: newResponse.trim() },
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setNewResponse("");
        await fetchTickets();
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add response");
      console.error("Response error:", error);
    }
  };

  // Update status
  const handleStatusUpdate = async (ticketId, newStatus) => {
    if (!["open", "pending", "resolved", "closed"].includes(newStatus)) {
      toast.error("Invalid status value");
      return;
    }

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}/status`,
        { status: newStatus },
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      if (data.success) {
        toast.success(data.message);
        await fetchTickets();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
      console.error("Status update error:", error);
    }
  };

  // Update priority
  const handlePriorityUpdate = async (ticketId, newPriority) => {
    if (!["low", "medium", "high"].includes(newPriority)) {
      toast.error("Invalid priority value");
      return;
    }

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}/priority`,
        { priority: newPriority },
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      if (data.success) {
        toast.success(data.message);
        await fetchTickets();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update priority");
      console.error("Priority update error:", error);
    }
  };

  // Close ticket
  const handleCloseTicket = async (ticketId) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}/close`,
        {},
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      if (data.success) {
        toast.success(data.message);
        await fetchTickets();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to close ticket");
      console.error("Close ticket error:", error);
    }
  };

  // Get ticket details
  const fetchTicketDetails = async (ticketId) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets/get/${ticketId}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch ticket details"
      );
      console.error("Fetch ticket details error:", error);
      throw error;
    }
  };

  const handleTicketClick = async (ticketId) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets/get/${ticketId}`
      );
      if (data.success) {
        setSelectedTicket(data.data);
        setIsDialogOpen(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch ticket details"
      );
      console.error("Fetch ticket details error:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentPage, filterStatus, searchQuery]);

  // Status and priority badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      open: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      closed: "bg-gray-100 text-gray-800",
      resolved: "bg-blue-100 text-blue-800",
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
      low: "bg-blue-100 text-blue-800",
    };

    return (
      <Badge variant="secondary" className={priorityStyles[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Support Tickets</CardTitle>
              <CardDescription>
                View and manage your support tickets
              </CardDescription>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
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
          {loading ? (
            <div className="text-center py-4">Loading tickets...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket._id}>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => handleTicketClick(ticket._id)}
                      >
                        {ticket.subject}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Store className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {ticket.seller.shopName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <User className="h-3 w-3" />
                            <span>{ticket.seller.proprietorName}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {ticket.status !== "closed" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleTicketClick(ticket._id)}
                              >
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(ticket._id, "resolved")
                                }
                              >
                                Mark as Resolved
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleCloseTicket(ticket._id)}
                              >
                                Close Ticket
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Details Dialog */}
      {selectedTicket && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-lg">Ticket Details</span>
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <h4 className="font-semibold">Category</h4>
                <p className="text-sm text-gray-600">
                  {selectedTicket.category}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Dates</h4>
                <div className="space-y-0.5">
                  <p className="text-sm text-gray-600 break-words">
                    Created:{" "}
                    {new Date(selectedTicket.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 break-words">
                    Updated:{" "}
                    {new Date(selectedTicket.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-gray-600 break-words whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Responses</h4>
                <div className="space-y-3">
                  {selectedTicket.responses?.map((response, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        response.from === "admin"
                          ? "bg-blue-50 ml-0 sm:ml-4"
                          : "bg-gray-50 mr-0 sm:mr-4"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <p className="text-sm break-words whitespace-pre-wrap">
                          {response.message}
                        </p>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(response.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTicket.status !== "closed" && (
                <div>
                  <h4 className="font-semibold mb-2">Add Response</h4>
                  <Textarea
                    placeholder="Type your response..."
                    className="min-h-[100px] w-full"
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                  />
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
              {selectedTicket.status !== "closed" && (
                <>
                  <Select
                    value={selectedTicket.status}
                    onValueChange={(value) =>
                      handleStatusUpdate(selectedTicket._id, value)
                    }
                  >
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => handleAddResponse(selectedTicket._id)}
                  >
                    Send Response
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SellerSupportTickets;
