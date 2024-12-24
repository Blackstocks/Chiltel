import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

const RiderAssignmentCell = ({ service, riders, handleRiderAssignment }) => {
  return (
    <div className="space-y-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            {service.assignedRider ? "Reassign Rider" : "Assign Rider"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {service.assignedRider ? "Reassign Rider" : "Assign Rider"}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-2">
              {Array.isArray(riders) &&
                riders
                  .filter((rider) => rider.status === "ONLINE")
                  .map((rider) => (
                    <Card
                      key={rider._id}
                      className={`cursor-pointer hover:bg-accent transition-colors ${
                        service.assignedRider === rider._id ? "border-primary" : ""
                      }`}
                      onClick={() => {
                        handleRiderAssignment(service._id, rider._id);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {`${rider.firstName} ${rider.lastName}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {rider.specialization}
                            </p>
                          </div>
                          <div className="text-sm">
                            {rider?.rating?.average?.toFixed(1) || "0.0"}★
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {service.assignedRider && (
        <Badge variant="outline">
          Currently Assigned:{" "}
          {riders.find((r) => r._id === service.assignedRider)
            ? `${
                riders.find((r) => r._id === service.assignedRider).firstName
              } ${riders.find((r) => r._id === service.assignedRider).lastName}`
            : ""}
        </Badge>
      )}
    </div>
  );
};

export default RiderAssignmentCell;