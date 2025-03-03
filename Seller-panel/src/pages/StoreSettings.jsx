import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Store,
  Building2,
  Receipt,
  Upload,
  FileCheck,
  Settings,
  Edit,
} from "lucide-react";

const StoreSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState({
    basic: false,
    bank: false,
  });
  const [formData, setFormData] = useState({
    shopName: user?.shopName || "",
    proprietorName: user?.proprietorName || "",
    phoneNumber: user?.phoneNumber || "",
    registeredAddress: {
      street: user?.registeredAddress?.street || "",
      city: user?.registeredAddress?.city || "",
      state: user?.registeredAddress?.state || "",
      pincode: user?.registeredAddress?.pincode || "",
    },
    warehouseAddress: {
      street: user?.warehouseAddress?.street || "",
      city: user?.warehouseAddress?.city || "",
      state: user?.warehouseAddress?.state || "",
      pincode: user?.warehouseAddress?.pincode || "",
    },
    gstNumber: user?.gstNumber || "",
    bankDetails: {
      beneficiaryAccount: user?.bankDetails?.accountNumber || "",
      beneficiaryIFSC: user?.bankDetails?.ifscCode || "",
      beneficiaryName: user?.bankDetails?.holderName || "",
      beneficiaryMobile: user?.bankDetails?.mobileNumber || "",
    },
  });

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [verificationStatus, setVerificationStatus] = useState({
    gst: false,
    bank: false,
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, JPEG, or PNG file");
      return;
    }

    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 20MB");
      return;
    }

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("document", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/upload-document`,
        {
          method: "POST",
          body: uploadFormData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Upload failed");

      toast.success("Certificate uploaded successfully");
    } catch (error) {
      toast.error(error.message || "Failed to upload certificate");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id.includes("beneficiary") || id.includes("account")) {
      const field = id;
      setFormData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field === "accountNumber"
            ? "beneficiaryAccount"
            : field === "ifscCode"
            ? "beneficiaryIFSC"
            : field === "beneficiaryName"
            ? "beneficiaryName"
            : field === "beneficiaryMobile"
            ? "beneficiaryMobile"
            : field]: value,
        },
      }));
    } else if (id.startsWith("reg")) {
      const field = id.replace("reg", "").toLowerCase();
      setFormData((prev) => ({
        ...prev,
        registeredAddress: {
          ...prev.registeredAddress,
          [field]: value,
        },
      }));
    } else if (id.startsWith("warehouse")) {
      const field = id.replace("warehouse", "").toLowerCase();
      setFormData((prev) => ({
        ...prev,
        warehouseAddress: {
          ...prev.warehouseAddress,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleBasicDetailsSave = async () => {
    try {
      setLoading(true);
      const updateData = {
        shopName: formData.shopName,
        proprietorName: formData.proprietorName,
        phoneNumber: formData.phoneNumber,
        registeredAddress: formData.registeredAddress,
        warehouseAddress: formData.warehouseAddress,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("Basic details updated successfully");
      setEditMode((prev) => ({ ...prev, basic: false }));
    } catch (error) {
      toast.error(error.message || "Failed to update basic details");
    } finally {
      setLoading(false);
    }
  };

  const validateGSTNumber = (gstNumber) => {
    // GST format: 2 digits, 10 characters PAN, 1 digit entity number, 1 digit Z, 1 digit checksum
    const gstPattern =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstPattern.test(gstNumber);
  };

  const validateAccountNumber = (accountNumber) => {
    // Account number should be between 9 and 18 digits
    const accPattern = /^\d{9,18}$/;
    return accPattern.test(accountNumber);
  };

  // Add this new function for GST verification
  const verifyGSTDetails = async () => {
    const gstVerifyResponse = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/seller/verify-gst`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ gstNumber: formData.gstNumber }),
      }
    );

    const gstData = await gstVerifyResponse.json();
    if (!gstVerifyResponse.ok) {
      throw new Error(gstData.message || "GST verification failed");
    }

    // Check if GST details match with shop details
    // if (
    //   gstData.data?.tradeName &&
    //   !gstData.data.tradeName
    //     .toLowerCase()
    //     .includes(formData.shopName.toLowerCase())
    // ) {
    //   throw new Error(
    //     "GST registered business name doesn't match with shop name"
    //   );
    // }

    return gstData;
  };

  // Add this new function for bank verification
  const verifyBankDetails = async () => {
    // First verify bank account
    const bankVerifyResponse = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/seller/verify-bank-details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          beneficiaryAccount: formData.bankDetails.beneficiaryAccount,
          beneficiaryIFSC: formData.bankDetails.beneficiaryIFSC,
          beneficiaryName: formData.bankDetails.beneficiaryName,
          beneficiaryMobile: formData.bankDetails.beneficiaryMobile,
          sellerId: user?._id,
        }),
      }
    );

    const bankData = await bankVerifyResponse.json();
    if (!bankVerifyResponse.ok) {
      throw new Error(bankData.message || "Bank verification failed");
    }

    if (!bankData.data.accountExists) {
      throw new Error(
        "Bank account verification failed. Please check your details."
      );
    }
  };

  const handleGSTVerification = async () => {
    try {
      if (!validateGSTNumber(formData.gstNumber)) {
        toast.error("Please enter a valid GST number");
        return;
      }

      setLoading(true);
      const gstData = await verifyGSTDetails();
      toast.success("GST verification successful");
      setVerificationStatus((prev) => ({ ...prev, gst: true }));
    } catch (error) {
      toast.error(`GST Verification Failed: ${error.message}`);
      setVerificationStatus((prev) => ({ ...prev, gst: false }));
    } finally {
      setLoading(false);
    }
  };

  const handleBankVerification = async () => {
    try {
      if (
        !formData.bankDetails.beneficiaryIFSC.trim() ||
        !formData.bankDetails.beneficiaryAccount.trim() ||
        !formData.bankDetails.beneficiaryName.trim() ||
        !formData.bankDetails.beneficiaryMobile.trim()
      ) {
        toast.error("Please enter all bank details");
        return;
      }

      if (!validateAccountNumber(formData.bankDetails.beneficiaryAccount)) {
        toast.error("Please enter a valid account number (9-18 digits)");
        return;
      }

      setLoading(true);
      await verifyBankDetails();
      toast.success("Bank details verification successful");
      setVerificationStatus((prev) => ({ ...prev, bank: true }));
    } catch (error) {
      toast.error(`Bank Verification Failed: ${error.message}`);
      setVerificationStatus((prev) => ({ ...prev, bank: false }));
    } finally {
      setLoading(false);
    }
  };

  const handleBankDetailsSave = async () => {
    try {
      if (!verificationStatus.gst || !verificationStatus.bank) {
        toast.error("Please verify both GST and Bank details before saving");
        return;
      }

      setLoading(true);

      // Re-verify both to ensure data hasn't changed
      await verifyBankDetails();

      const updateData = {
        gstNumber: formData.gstNumber,
        gstDetails: {
          tradeName: gstData.data.tradeName,
          legalName: gstData.data.legalName,
          status: gstData.data.status,
          verifiedAt: new Date().toISOString(),
        },
        bankDetails: {
          ...formData.bankDetails,
          verified: true,
          verifiedAt: new Date().toISOString(),
        },
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("Bank and GST details updated successfully");
      setEditMode((prev) => ({ ...prev, bank: false }));
    } catch (error) {
      toast.error(error.message || "Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (section) => {
    setFormData((prev) => ({
      ...prev,
      ...(section === "basic" && {
        shopName: user?.shopName || "",
        proprietorName: user?.proprietorName || "",
        phoneNumber: user?.phoneNumber || "",
        registeredAddress: user?.registeredAddress || {},
        warehouseAddress: user?.warehouseAddress || {},
      }),
      ...(section === "bank" && {
        gstNumber: user?.gstNumber || "",
        bankDetails: user?.bankDetails || {},
      }),
    }));
    setEditMode((prev) => ({ ...prev, [section]: false }));
    setVerificationStatus({ gst: false, bank: false });
    toast.info("Changes discarded");
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="h-full">
        <CardHeader className="py-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle className="text-lg">Store Settings</CardTitle>
          </div>
          <CardDescription className="text-sm">
            Manage your store details, bank information, and documents
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 h-[calc(100%-100px)] overflow-auto">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic Details</TabsTrigger>
              <TabsTrigger value="bank">Bank & Tax</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-0">
              <div className="grid gap-4">
                {/* Store Information */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="h-4 w-4" />
                    <h3 className="font-semibold text-sm">Store Information</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditMode((prev) => ({ ...prev, basic: !prev.basic }))
                      }
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {editMode.basic ? "Cancel Edit" : "Edit Details"}
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="shopName" className="text-xs">
                        Shop Name
                      </Label>
                      <Input
                        id="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                        placeholder="Enter shop name"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="proprietorName" className="text-xs">
                        Proprietor Name
                      </Label>
                      <Input
                        id="proprietorName"
                        value={formData.proprietorName}
                        onChange={handleChange}
                        placeholder="Enter proprietor name"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber" className="text-xs">
                        Contact Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4" />
                    <h3 className="font-semibold text-sm">Addresses</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {/* Registered Address */}
                    <div className="space-y-2">
                      <Label className="text-xs">Registered Address</Label>
                      <Input
                        id="regStreet"
                        value={formData.registeredAddress.street}
                        onChange={handleChange}
                        placeholder="Street"
                        className="h-8 text-sm"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          id="regCity"
                          value={formData.registeredAddress.city}
                          onChange={handleChange}
                          placeholder="City"
                          className="h-8 text-sm"
                        />
                        <Input
                          id="regState"
                          value={formData.registeredAddress.state}
                          onChange={handleChange}
                          placeholder="State"
                          className="h-8 text-sm"
                        />
                        <Input
                          id="regPincode"
                          value={formData.registeredAddress.pincode}
                          onChange={handleChange}
                          placeholder="Pincode"
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    {/* Warehouse Address */}
                    <div className="space-y-2">
                      <Label className="text-xs">Warehouse Address</Label>
                      <Input
                        id="warehouseStreet"
                        value={formData.warehouseAddress.street}
                        onChange={handleChange}
                        placeholder="Street"
                        className="h-8 text-sm"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          id="warehouseCity"
                          value={formData.warehouseAddress.city}
                          onChange={handleChange}
                          placeholder="City"
                          className="h-8 text-sm"
                        />
                        <Input
                          id="warehouseState"
                          value={formData.warehouseAddress.state}
                          onChange={handleChange}
                          placeholder="State"
                          className="h-8 text-sm"
                        />
                        <Input
                          id="warehousePincode"
                          value={formData.warehouseAddress.pincode}
                          onChange={handleChange}
                          placeholder="Pincode"
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {editMode.basic && (
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("basic")}
                    disabled={loading}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBasicDetailsSave}
                    disabled={loading}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bank" className="mt-0">
              <div className="grid gap-4">
                <div className="flex items-center gap-2 mb-2">
                  <Receipt className="h-4 w-4" />
                  <h3 className="font-semibold text-sm">Bank & Tax Details</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setEditMode((prev) => ({ ...prev, bank: !prev.bank }))
                    }
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {editMode.bank ? "Cancel Edit" : "Edit Details"}
                  </Button>
                </div>

                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="gstNumber" className="text-xs">
                      GST Number
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleChange}
                        placeholder="Enter GST number"
                        className="h-8 text-sm flex-1"
                        disabled={!editMode.bank}
                      />
                      {editMode.bank && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGSTVerification}
                          disabled={loading}
                          className={`whitespace-nowrap ${
                            verificationStatus.gst ? "bg-green-50" : ""
                          }`}
                        >
                          {verificationStatus.gst ? (
                            <>
                              <FileCheck className="h-4 w-4 mr-2 text-green-500" />
                              <span className="hidden sm:inline">Verified</span>
                              <span className="sm:hidden">GST ✓</span>
                            </>
                          ) : (
                            <>
                              <span className="hidden sm:inline">
                                Verify GST
                              </span>
                              <span className="sm:hidden">Verify</span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">
                      Bank Account Details
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="beneficiaryAccount" className="text-xs">
                          Account Number
                        </Label>
                        <Input
                          id="beneficiaryAccount"
                          value={formData.bankDetails.beneficiaryAccount}
                          onChange={handleChange}
                          placeholder="Enter account number"
                          className="h-8 text-sm"
                          disabled={!editMode.bank}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="beneficiaryIFSC" className="text-xs">
                          IFSC Code
                        </Label>
                        <Input
                          id="beneficiaryIFSC"
                          value={formData.bankDetails.beneficiaryIFSC}
                          onChange={handleChange}
                          placeholder="Enter IFSC code"
                          className="h-8 text-sm"
                          disabled={!editMode.bank}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="beneficiaryName" className="text-xs">
                          Beneficiary Name
                        </Label>
                        <Input
                          id="beneficiaryName"
                          value={formData.bankDetails.beneficiaryName}
                          onChange={handleChange}
                          placeholder="Enter beneficiary name"
                          className="h-8 text-sm"
                          disabled={!editMode.bank}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="beneficiaryMobile" className="text-xs">
                          Mobile Number
                        </Label>
                        <Input
                          id="beneficiaryMobile"
                          value={formData.bankDetails.beneficiaryMobile}
                          onChange={handleChange}
                          placeholder="Enter mobile number"
                          className="h-8 text-sm"
                          disabled={!editMode.bank}
                        />
                      </div>
                    </div>

                    {editMode.bank && (
                      <div className="flex justify-end mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBankVerification}
                          disabled={loading}
                          className={`whitespace-nowrap ${
                            verificationStatus.bank ? "bg-green-50" : ""
                          }`}
                        >
                          {verificationStatus.bank ? (
                            <>
                              <FileCheck className="h-4 w-4 mr-2 text-green-500" />
                              <span className="hidden sm:inline">
                                Bank Details Verified
                              </span>
                              <span className="sm:hidden">Bank ✓</span>
                            </>
                          ) : (
                            <>
                              <span className="hidden sm:inline">
                                Verify Bank Details
                              </span>
                              <span className="sm:hidden">Verify Bank</span>
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {editMode.bank && (
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleCancel("bank")}
                    disabled={loading}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBankDetailsSave}
                    disabled={
                      loading ||
                      !verificationStatus.gst ||
                      !verificationStatus.bank
                    }
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileCheck className="h-4 w-4" />
                  <h3 className="font-semibold text-sm">Required Documents</h3>
                </div>

                <Card className="mt-2">
                  <CardContent className="p-4">
                    {user.dealerCertificate ? (
                      <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            Certificate uploaded on{" "}
                            {new Date(
                              user.dealerCertificate.uploadDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? "Uploading..." : "Update"}
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-center border-2 border-dashed rounded-lg p-4"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <div className="text-center">
                          <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                          <p className="text-xs text-gray-600">
                            Drag and drop certificate or click to browse
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            {isUploading
                              ? "Uploading..."
                              : "Upload Certificate"}
                          </Button>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileUpload}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreSettings;
