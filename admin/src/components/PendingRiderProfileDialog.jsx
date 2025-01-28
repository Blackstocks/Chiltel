import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Badge } from "@/components/ui/badge";
  import { Card, CardContent } from "@/components/ui/card";
  import { 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    Calendar,
    Building2,
    ShieldAlert,
    CheckCircle,
    XCircle,
    CreditCard,
    Briefcase,
    Star,
    Clock,
    IndianRupee,
    MapPinned,
    CalendarRange
  } from "lucide-react";
  
  const RiderProfileDialog = ({ isOpen, onClose, rider }) => {
    if (!rider) return null;
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Rider Profile</span>
              <Badge variant={
                rider.registrationStatus === "PENDING" ? "warning" :
                rider.registrationStatus === "APPROVED" ? "success" : "destructive"
              }>
                {rider.registrationStatus}
              </Badge>
            </DialogTitle>
          </DialogHeader>
  
          <div className="grid gap-6">
            {/* Basic Information */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-24 w-24 rounded-lg overflow-hidden">
                    <img src={rider.imageUrl} alt={rider.firstName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">
                      {rider.firstName} {rider.lastName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0" />
                        {rider.phoneNumber}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 shrink-0" />
                        {rider.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 shrink-0" />
                        Father: {rider.fatherName}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        DOB: {new Date(rider.dateOfBirth).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 md:col-span-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        {rider.address}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            {/* Status and Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium mb-4">Current Status</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Status</span>
                      </div>
                      <Badge variant={
                        rider.status === "AVAILABLE" ? "success" :
                        rider.status === "BUSY" ? "warning" : "secondary"
                      }>
                        {rider.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span>Rating</span>
                      </div>
                      <span className="font-medium">
                        {rider.rating.average.toFixed(1)} ★ ({rider.rating.count} reviews)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
  
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium mb-4">Service Stats</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Completed Services</span>
                      </div>
                      <span>{rider.services.completed} / {rider.services.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4" />
                        <span>Current Balance</span>
                      </div>
                      <span>₹{rider.balance}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
  
            {/* Bank Details */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium mb-4">Bank & Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Bank Details
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1 pl-6">
                      <p>Account: {rider.bankDetails.accountNumber}</p>
                      <p>IFSC: {rider.bankDetails.ifscCode}</p>
                      <p>Holder: {rider.bankDetails.holderName}</p>
                      <p>Mobile: {rider.bankDetails.mobileNumber}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Documents
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1 pl-6">
                      <p>PAN: {rider.panNumber}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            {/* Specializations */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {rider.specializations.map((spec, index) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
  
            {/* Location */}
            {rider.location?.coordinates && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <MapPinned className="h-4 w-4" />
                    Current Location
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    Latitude: {rider.location.coordinates[1]}, 
                    Longitude: {rider.location.coordinates[0]}
                  </div>
                </CardContent>
              </Card>
            )}
  
            {/* Attendance */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <CalendarRange className="h-4 w-4" />
                  Recent Attendance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Leaves</h4>
                    {rider.attendance?.leaves?.slice(0, 3).map((leave, index) => (
                      <div key={index} className="text-sm text-muted-foreground mb-2">
                        <p>{new Date(leave.date).toLocaleDateString()}</p>
                        <p className="text-xs">Reason: {leave.reason}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Present Days</h4>
                    {rider.attendance?.present?.slice(0, 3).map((day, index) => (
                      <div key={index} className="text-sm text-muted-foreground mb-1">
                        {new Date(day.date).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default RiderProfileDialog;