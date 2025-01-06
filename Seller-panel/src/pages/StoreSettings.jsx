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
import { useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { toast } from "react-toastify";

const StoreSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: user.shopName,
    proprietorName: user.proprietorName,
    aadharNumber: user.aadharNumber,
    phoneNumber: user.phoneNumber,
    registeredAddress: `${user.registeredAddress.street}, ${user.registeredAddress.city}, ${user.registeredAddress.state} - ${user.registeredAddress.pincode}`,
    warehouseAddress: `${user.warehouseAddress.street}, ${user.warehouseAddress.city}, ${user.warehouseAddress.state} - ${user.warehouseAddress.pincode}`,
    gstNumber: user.gstNumber,
    bankDetails: {
      accountNumber: user.bankDetails.accountNumber,
      ifscCode: user.bankDetails.ifscCode,
      bankName: user.bankDetails.bankName
    }
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id.startsWith('bank')) {
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [id.replace('bank', '').toLowerCase()]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleCancel = () => {
    setFormData({
      shopName: user.shopName,
      proprietorName: user.proprietorName,
      aadharNumber: user.aadharNumber,
      phoneNumber: user.phoneNumber,
      registeredAddress: `${user.registeredAddress.street}, ${user.registeredAddress.city}, ${user.registeredAddress.state} - ${user.registeredAddress.pincode}`,
      warehouseAddress: `${user.warehouseAddress.street}, ${user.warehouseAddress.city}, ${user.warehouseAddress.state} - ${user.warehouseAddress.pincode}`,
      gstNumber: user.gstNumber,
      bankDetails: {
        accountNumber: user.bankDetails.accountNumber,
        ifscCode: user.bankDetails.ifscCode,
        bankName: user.bankDetails.bankName
      }
    });
    toast.info('Changes discarded');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Split addresses into components
      const [regStreet, regCity, regStatePin] = formData.registeredAddress.split(', ');
      const [regState, regPincode] = regStatePin.split(' - ');
      
      const [whStreet, whCity, whStatePin] = formData.warehouseAddress.split(', ');
      const [whState, whPincode] = whStatePin.split(' - ');

      const updateData = {
        shopName: formData.shopName,
        proprietorName: formData.proprietorName,
        phoneNumber: formData.phoneNumber,
        gstNumber: formData.gstNumber,
        registeredAddress: {
          street: regStreet,
          city: regCity,
          state: regState,
          pincode: regPincode
        },
        warehouseAddress: {
          street: whStreet,
          city: whCity,
          state: whState,
          pincode: whPincode
        },
        bankDetails: {
          accountNumber: formData.bankDetails.accountNumber,
          ifscCode: formData.bankDetails.ifscCode,
          bankName: formData.bankDetails.bankName
        }
      };

      const response = await fetch('/api/seller/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update settings');
      }

      toast.success(data.message || 'Settings updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('certificate', file);

    try {
      setLoading(true);
      const response = await fetch('/api/seller/upload-certificate', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload certificate');

      toast.success('Certificate uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                      <Input 
                        id="firmName" 
                        defaultValue={user.shopName} 
                        placeholder="Enter firm name" 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="proprietorName">Proprietor Name</Label>
                      <Input 
                        id="proprietorName" 
                        defaultValue={user.proprietorName}
                        placeholder="Enter proprietor name" 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="aadhar">Aadhar Card Number</Label>
                      <Input 
                        id="aadhar" 
                        defaultValue={user.aadharNumber}
                        placeholder="Enter Aadhar number" 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Contact Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        defaultValue={user.phoneNumber}
                        placeholder="Enter phone number" 
                        onChange={handleChange}
                      />
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
                      <Input 
                        id="regAddress" 
                        defaultValue={`${user.registeredAddress.street}, ${user.registeredAddress.city}, ${user.registeredAddress.state} - ${user.registeredAddress.pincode}`}
                        placeholder="Enter registered address" 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="warehouse">Warehouse Address</Label>
                      <Input 
                        id="warehouse" 
                        defaultValue={`${user.warehouseAddress.street}, ${user.warehouseAddress.city}, ${user.warehouseAddress.state} - ${user.warehouseAddress.pincode}`}
                        placeholder="Enter warehouse address" 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bank">
              <div className="grid gap-6">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  <h3 className="font-semibold">Bank & Tax Information</h3>
                </div>
                
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="gst">GST Number</Label>
                    <Input 
                      id="gst" 
                      defaultValue={user.gstNumber}
                      placeholder="Enter GST number" 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="accountNo">Bank Account Number</Label>
                      <Input 
                        id="accountNo" 
                        defaultValue={user.bankDetails.accountNumber}
                        placeholder="Enter account number" 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input 
                        id="ifsc" 
                        defaultValue={user.bankDetails.ifscCode}
                        placeholder="Enter IFSC code" 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input 
                        id="bankName" 
                        defaultValue={user.bankDetails.bankName}
                        placeholder="Enter bank name" 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

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
                        {user.dealerCertificate ? (
                          <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-2">
                              <FileCheck className="h-5 w-5 text-green-500" />
                              <span>Certificate uploaded on {new Date(user.dealerCertificate.uploadDate).toLocaleDateString()}</span>
                            </div>
                            <Button variant="outline" onClick={handleFileUpload}>Update Certificate</Button>
                          </div>
                        ) : (
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
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-8 gap-4">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreSettings;