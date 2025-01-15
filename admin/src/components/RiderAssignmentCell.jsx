import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckIcon } from "lucide-react";

const RiderAssignmentCell = ({ service, riders, handleRiderAssignment }) => {
  const [selectedRiders, setSelectedRiders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const eligibleRiders = riders.filter(
    (rider) =>
      service.service &&
      rider.specializations.includes(service.service.product)
  );

  const handleSelect = (riderId) => {
    setSelectedRiders(prev =>
      prev.includes(riderId)
        ? prev.filter(id => id !== riderId)
        : [...prev, riderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRiders.length === eligibleRiders.length) {
      setSelectedRiders([]);
    } else {
      setSelectedRiders(eligibleRiders.map(rider => rider._id));
    }
  };

  const handleAssignSelected = async () => {
    try {
      // Assuming handleRiderAssignment can be modified to accept array of rider IDs
      await Promise.all(
        selectedRiders.map(riderId => 
          handleRiderAssignment(service._id, riderId)
        )
      );
      setIsOpen(false);
      setSelectedRiders([]);
    } catch (error) {
      console.error('Error assigning riders:', error);
    }
  };

  return (
    <div className="space-y-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            {service.assignedRider ? "Reassign Riders" : "Assign Riders"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {service.assignedRider ? "Reassign Riders" : "Assign Riders"}
            </DialogTitle>
          </DialogHeader>
          
          {eligibleRiders.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="flex items-center gap-2"
              >
                <Checkbox
                  checked={selectedRiders.length === eligibleRiders.length}
                  className="h-4 w-4"
                />
                {selectedRiders.length === eligibleRiders.length 
                  ? "Deselect All" 
                  : "Select All"}
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedRiders.length} selected
              </span>
            </div>
          )}

          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-2">
              {eligibleRiders.length > 0 ? (
                eligibleRiders.map((rider) => (
                  <Card
                    key={rider._id}
                    className={`cursor-pointer hover:bg-accent transition-colors ${
                      selectedRiders.includes(rider._id) ? "border-primary" : ""
                    }`}
                    onClick={() => handleSelect(rider._id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedRiders.includes(rider._id)}
                            className="h-4 w-4"
                          />
                          <div>
                            <p className="font-medium">
                              {`${rider.firstName} ${rider.lastName}`}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rider.specializations.map((spec, index) => (
                                <span
                                  key={index}
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    spec === service.service.product
                                      ? "bg-primary/10 text-primary"
                                      : "bg-secondary/50 text-secondary-foreground"
                                  }`}
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">
                          {rider?.rating?.average?.toFixed(1) || "0.0"}★
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>No riders with the required specialization found</p>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setSelectedRiders([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignSelected}
              disabled={selectedRiders.length === 0}
            >
              Assign Selected ({selectedRiders.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {service.assignedRider && (
        <div className="flex flex-wrap gap-1">
          {riders
            .filter(r => r._id === service.assignedRider)
            .map(rider => (
              <Badge key={rider._id} variant="outline">
                Currently Assigned: {`${rider.firstName} ${rider.lastName}`}
              </Badge>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default RiderAssignmentCell;