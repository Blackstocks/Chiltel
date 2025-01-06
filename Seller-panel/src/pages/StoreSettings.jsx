import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  Building2, 
  Receipt, 
  Upload, 
  FileCheck,
  Settings
} from "lucide-react";

const StoreSettings = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            <CardTitle>Store Settings</CardTitle>
          </div>
          <CardDescription>
            Manage your store details, bank information, and documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="basic">Basic Details</TabsTrigger>
              <TabsTrigger value="bank">Bank & Tax</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Basic Details Tab */}
            <TabsContent value="basic">
              <div className="grid gap-6">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  <h3 className="font-semibold">Store Information</h3>
                </div>
                
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firmName">Firm/Shop Name</Label>
                      <Input id="firmName" placeholder="Enter firm name" />
                    </div>
                    <div>
                      <Label htmlFor="proprietorName">Proprietor Name</Label>
                      <Input id="proprietorName" placeholder="Enter proprietor name" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="aadhar">Aadhar Card Number</Label>
                      <Input id="aadhar" placeholder="Enter Aadhar number" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Contact Number</Label>
                      <Input id="phone" type="tel" placeholder="Enter phone number" />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5" />
                    <h3 className="font-semibold">Address Details</h3>
                  </div>
                  
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="regAddress">Registered Address</Label>
                      <Input id="regAddress" placeholder="Enter registered address" />
                    </div>
                    <div>
                      <Label htmlFor="warehouse">Warehouse Address</Label>
                      <Input id="warehouse" placeholder="Enter warehouse address" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Bank & Tax Tab */}
            <TabsContent value="bank">
              <div className="grid gap-6">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  <h3 className="font-semibold">Bank & Tax Information</h3>
                </div>
                
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="gst">GST Number</Label>
                    <Input id="gst" placeholder="Enter GST number" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="accountNo">Bank Account Number</Label>
                      <Input id="accountNo" placeholder="Enter account number" />
                    </div>
                    <div>
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input id="ifsc" placeholder="Enter IFSC code" />
                    </div>
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input id="bankName" placeholder="Enter bank name" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <div className="grid gap-6">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  <h3 className="font-semibold">Required Documents</h3>
                </div>
                
                <div className="grid gap-6">
                  <div>
                    <Label>Distributor/Dealer Certificate</Label>
                    <Card className="mt-2">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6">
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              Drag and drop your certificate here or click to browse
                            </p>
                            <Button variant="outline" className="mt-4">
                              Upload Certificate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-8 gap-4">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreSettings;