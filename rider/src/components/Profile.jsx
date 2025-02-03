// ProfileTab.jsx
import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useAuthActions } from "../hooks/useAuthActions";
import { useProfile } from "../hooks/useProfile";
import { toast } from "react-toastify";
import { AlertCircle, Save, LogOut, User, Briefcase, Info, Star, Calendar, MapPin } from 'lucide-react';
import Loader from "./Loader";
import StatsSection from './ui/statsection';

const ProfileTab = () => {
  const { logout } = useAuthActions();
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    fatherName: "",
    dateOfBirth: "",
    imageUrl: "",
    address: "",
    specializations: [],
    bankDetails: {
      accountNumber: "",
      holderName: "",
      ifscCode: "",
      mobileNumber: "",
    },
    balance: 0,
    panNumber: "",
    rating: { average: 0, count: 0 },
    registrationStatus: "",
    services: { completed: 0, total: 0 },
    status: "",
  });

  const specializations = [
    { value: "Air Conditioner", label: "Air Conditioner Service & Repair" },
    { value: "Water Heater", label: "Water Heater Service & Repair" },
    { value: "Microwave", label: "Microwave Service & Repair" },
    { value: "Geyser", label: "Geyser Service & Repair" },
    { value: "Refrigerator", label: "Refrigerator Service & Repair" },
    { value: "Washing Machine", label: "Washing Machine Service & Repair" },
    { value: "Air Cooler", label: "Air Cooler Service & Repair" },
    { value: "Air Purifier", label: "Air Purifier Service & Repair" },
    { value: "Water Purifier", label: "Water Purifier Service & Repair" },
    { value: "Deep Freezer", label: "Deep Freezer Service & Repair" },
    { value: "Visi Cooler", label: "Visi Cooler Service & Repair" },
    { value: "Cassette AC", label: "Cassette AC Service & Repair" },
    { value: "Water Cooler cum Purifier", label: "Water Cooler cum Purifier Service & Repair" },
    { value: "Water Dispenser", label: "Water Dispenser Service & Repair" },
    { value: "Display Counter", label: "Display Counter Service & Repair" },
  ];

  const { profile, loading, error, updateProfile } = useProfile();

  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        fatherName: profile.fatherName,
        dateOfBirth: profile.dateOfBirth,
        address: profile.address,
        specializations: profile.specializations || [],
        bankDetails: profile.bankDetails || {},
        balance: profile.balance || 0,
        panNumber: profile.panNumber || "",
        rating: profile.rating || { average: 0, count: 0 },
        registrationStatus: profile.registrationStatus || "",
        services: profile.services || { completed: 0, total: 0 },
        status: profile.status || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSpecializationToggle = (value) => {
    setProfileData((prev) => {
      const specializations = prev.specializations.includes(value)
        ? prev.specializations.filter((spec) => spec !== value)
        : [...prev.specializations, value];
      return { ...prev, specializations };
    });
  };

  const handleSaveChanges = async () => {
    if (
      !profileData.firstName ||
      !profileData.lastName ||
      !profileData.email ||
      !profileData.phoneNumber ||
      !profileData.fatherName ||
      !profileData.dateOfBirth ||
      !profileData.address ||
      profileData.specializations.length === 0
    ) {
      toast.error("All fields are required");
      return;
    }
    try {
      await updateProfile(profileData);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="p-2 transition-all transform border border-blue-100 shadow-sm bg-gradient-to-br from-white to-blue-50 sm:p-3 rounded-xl hover:scale-105">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-blue-600 sm:text-sm line-clamp-1">{title}</h3>
        <Icon className="flex-shrink-0 w-4 h-4 ml-2 text-blue-500" />
      </div>
      <p className="mt-1 text-lg font-bold text-gray-800 sm:mt-2 sm:text-xl">{value}</p>
    </div>
  );

  const FormField = ({ label, id, type = "text", defaultValue, className = "" }) => (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</Label>
      <Input
        id={id}
        type={type}
        defaultValue={defaultValue}
        onChange={handleChange}
        className={`bg-gray-50 focus:bg-white transition-colors border-gray-200 focus:border-blue-500 rounded-lg ${className}`}
      />
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader className="w-8 h-8 text-blue-500" />
    </div>
  );
  
  if (error) {
    return (
      <div className="flex items-center justify-center p-4 rounded-lg bg-red-50">
        <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
        <p className="text-sm text-red-700">Error loading profile</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl min-h-screen p-2 mx-auto space-y-4 sm:p-4 lg:p-6">
      {/* Profile Header */}
      <div className="p-3 mb-4 text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl sm:p-4 md:p-6 sm:mb-6">
        <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full sm:w-16 sm:h-16 bg-white/20">
            <User className="w-10 h-10 sm:w-8 sm:h-8" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">{profileData.firstName} {profileData.lastName}</h1>
            <p className="text-sm text-blue-100 sm:text-base">{profileData.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsSection profileData={profileData} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 md:gap-4">
        {/* Personal Information */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-500" />
              <div>
                <CardTitle className="text-lg text-gray-800">Personal Information</CardTitle>
                <CardDescription className="text-sm text-gray-500">Update your details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 pt-3">
		  <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name" id="firstName" defaultValue={profile.firstName} />
              <FormField label="Last Name" id="lastName" defaultValue={profile.lastName} />
            </div>
            <FormField label="Email" id="email" type="email" defaultValue={profile.email} />
            <FormField label="Phone" id="phoneNumber" defaultValue={profile.phoneNumber} />
            {/* <FormField label="Father's Name" id="fatherName" defaultValue={profile.fatherName} /> */}
            {/* <FormField label="Date of Birth" id="dateOfBirth" type="date" defaultValue={profile.dateOfBirth} /> */}
          </CardContent>
        </Card>

        {/* Address & Additional Info */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <div>
                <CardTitle className="text-lg text-gray-800">Location & Bank Details</CardTitle>
                <CardDescription className="text-sm text-gray-500">Your address and account info</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 pt-3">
		  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-500">Address</p>
    <p className="text-sm text-gray-700">{profile.address}</p>
  </div>
            <div className="p-3 space-y-2 rounded-lg bg-blue-50">
              <h3 className="font-medium text-blue-700">Bank Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Account Number</p>
                  <p className="font-medium">{profileData.bankDetails.accountNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">IFSC Code</p>
                  <p className="font-medium">{profileData.bankDetails.ifscCode}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specializations
      <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            <div>
              <CardTitle className="text-lg text-gray-800">Areas of Expertise</CardTitle>
              <CardDescription className="text-sm text-gray-500">Select your specializations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {specializations.map((spec) => (
              <div 
                key={spec.value} 
                className="flex items-center p-2 space-x-2 transition-colors rounded-lg hover:bg-blue-50"
              >
                <Checkbox
                  id={spec.value}
                  checked={profileData.specializations.includes(spec.value)}
                  onCheckedChange={() => handleSpecializationToggle(spec.value)}
                  className="data-[state=checked]:bg-blue-500 border-blue-200"
                />
                <Label 
                  htmlFor={spec.value}
                  className="text-sm text-gray-700 cursor-pointer hover:text-blue-600"
                >
                  {spec.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 border-t border-gray-100 shadow-lg md:sticky bg-white/80 backdrop-blur-sm md:p-4 md:border md:rounded-lg">
        <div className="flex flex-col items-stretch justify-between max-w-6xl gap-2 mx-auto xs:flex-row xs:items-center xs:gap-4">
        <Button 
          onClick={handleSaveChanges}
          className="flex items-center justify-center w-full py-4 space-x-2 text-white bg-blue-600 hover:bg-blue-700 xs:w-auto xs:py-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
        
        {/* <Button 
          variant="destructive" 
          onClick={logout}
          className="flex items-center justify-center w-full py-4 space-x-2 bg-red-500 hover:bg-red-600 xs:w-auto xs:py-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </Button> */}
      </div>
    </div>
	</div>
  );
};

export default ProfileTab;