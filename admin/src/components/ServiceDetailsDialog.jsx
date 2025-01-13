import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ServiceDetailsSheet = ({ service }) => {
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
      case "CREATED":
        return "bg-blue-200 text-blue-800";
      case "ASSIGNED":
        return "bg-purple-200 text-purple-800";
      case "REQUESTED":
        return "bg-yellow-200 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-orange-200 text-orange-800";
      case "COMPLETED":
        return "bg-green-200 text-green-800";
      case "CANCELLED":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-200 text-yellow-800";
      case "COMPLETED":
        return "bg-green-200 text-green-800";
      case "FAILED":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">View Service Details</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Service Request Details</SheetTitle>
          <SheetDescription>Request ID: {service._id}</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Name: {service.user.name}</p>
                <p className="text-sm">Email: {service.user.email}</p>
                <div className="pt-2">
                  <p className="font-medium text-sm">Service Location:</p>
                  <p className="text-sm">{service.userLocation.address}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Request Status:</p>
                  <Select defaultValue={service.status}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CREATED">Created</SelectItem>
                      <SelectItem value="ASSIGNED">Assigned</SelectItem>
                      <SelectItem value="REQUESTED">Requested</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Work Started:</span>
                  <Badge
                    className={
                      service.workStarted
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }
                  >
                    {service.workStarted ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Status:</span>
                  <Badge
                    className={getPaymentStatusColor(service.paymentStatus)}
                  >
                    {service.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium">Service Name:</p>
                  <p className="text-sm">{service.service?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Category:</p>
                  <p className="text-sm">{service.service?.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Price:</p>
                  <p className="text-sm">₹{service?.price}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Duration:</p>
                  <p className="text-sm">
                    {service.service?.estimatedDuration}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Scheduled For:</p>
                <p className="text-sm">{formatDate(service?.scheduledFor)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Requirements:</p>
                <ul className="list-disc pl-4 mt-1">
                  {service.service?.requirements.map((req, index) => (
                    <li key={index} className="text-sm">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              {service?.remarks && (
                <div>
                  <p className="text-sm font-medium">Remarks:</p>
                  <p className="text-sm">{service?.remarks}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {service?.addedWorks && service.addedWorks?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Work</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-2">
                  {service.addedWorks.map((work, index) => (
                    <li key={index} className="text-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <span>{work.description}</span>
                          <span className="ml-2 text-muted-foreground">
                            (₹{work.price.toLocaleString()})
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            work.approved
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {work.approved ? "Approved" : "Pending"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ServiceDetailsSheet;
