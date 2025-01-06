import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HelpCircle,
  MailOpen,
  MessageSquare,
  Phone,
  Search,
  TicketCheck
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const HelpAndSupport = () => {
  const [activeTab, setActiveTab] = useState('faq');

  // Sample FAQ data
  const faqData = [
    {
      question: "How do I create a new product listing?",
      answer: "To create a new product listing, go to your seller dashboard and click on 'Add Product'. Fill in all required details including product name, description, price, and images. Make sure to categorize your product correctly for better visibility."
    },
    {
      question: "How do I track my orders?",
      answer: "You can track all your orders from the 'Manage Orders' section in your dashboard. Each order will show its current status, and you can update the status as it progresses through different stages of fulfillment."
    },
    {
      question: "When will I receive my payments?",
      answer: "Payments are processed every 7 days for all completed orders. You can view your payment status and history in the 'Payment Management' section of your dashboard."
    },
    {
      question: "How do I handle returns?",
      answer: "When a return request is initiated, you'll receive a notification. Review the return reason and approve or decline the request within 48 hours. Once approved, provide return shipping instructions."
    }
  ];

  // Sample ticket data
  const ticketData = [
    {
      id: "TCK-001",
      subject: "Payment Delay",
      status: "open",
      created: "2024-01-05",
      lastUpdate: "2024-01-06"
    },
    {
      id: "TCK-002",
      subject: "Product Upload Issue",
      status: "closed",
      created: "2024-01-03",
      lastUpdate: "2024-01-05"
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-green-100 text-green-800 hover:bg-green-100",
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      closed: "bg-gray-100 text-gray-800 hover:bg-gray-100"
    };
    
    return (
      <Badge className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            <CardTitle>Help & Support</CardTitle>
          </div>
          <CardDescription>
            Get help with your store, create support tickets, and find answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search for help articles, FAQs, or type your question..."
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="cursor-pointer hover:bg-gray-50">
              <CardContent className="p-4 flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-semibold">Create New Ticket</h4>
                  <p className="text-sm text-gray-500">Get support for specific issues</p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-gray-50">
              <CardContent className="p-4 flex items-center gap-3">
                <MailOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-semibold">Email Support</h4>
                  <p className="text-sm text-gray-500">support@example.com</p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-gray-50">
              <CardContent className="p-4 flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-semibold">Phone Support</h4>
                  <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible>
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Create Ticket Form */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Create Support Ticket</h3>
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Brief description of your issue" />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="orders">Orders</SelectItem>
                        <SelectItem value="payments">Payments</SelectItem>
                        <SelectItem value="products">Products</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about your issue"
                      className="h-32"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <TicketCheck className="mr-2 h-4 w-4" />
                      Submit Ticket
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tickets */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Tickets</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ticketData.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{ticket.created}</TableCell>
                    <TableCell>{ticket.lastUpdate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpAndSupport;