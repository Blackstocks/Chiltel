import { useState } from 'react';
import { Store, Building2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'react-toastify';

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    shopName: '',
    proprietorName: '',
    aadharNumber: '',
    phoneNumber: '',
    registeredAddress: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    warehouseAddress: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id.includes('.')) {
      const [addressType, field] = id.split('.');
      setFormData(prev => ({
        ...prev,
        [addressType]: {
          ...prev[addressType],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/seller/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success(
        'After verification by our admin team, you will receive an email with your login credentials.',
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      
      window.location.href = '/registration-submitted';
    } catch (err) {
      setError(err.message);
      toast.error('Registration Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-h-[70vh] relative">
      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth scrollbar-thin">
        <form id="registrationForm" onSubmit={handleSubmit}>
          {/* Store Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              <h3 className="font-semibold">Store Information</h3>
            </div>
            
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Firm/Shop Name</Label>
                  <Input
                    id="shopName"
                    placeholder="Enter shop name"
                    value={formData.shopName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proprietorName">Proprietor Name</Label>
                  <Input
                    id="proprietorName"
                    placeholder="Enter proprietor name"
                    value={formData.proprietorName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aadharNumber">Aadhar Card Number</Label>
                  <Input
                    id="aadharNumber"
                    placeholder="Enter Aadhar number"
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    required
                    maxLength={12}
                    pattern="\d{12}"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Contact Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    pattern="\d{10}"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-6">
            {/* Registered Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <h3 className="font-semibold">Registered Address</h3>
              </div>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registeredAddress.street">Street Address</Label>
                  <Input
                    id="registeredAddress.street"
                    placeholder="Enter street address"
                    value={formData.registeredAddress.street}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registeredAddress.city">City</Label>
                    <Input
                      id="registeredAddress.city"
                      placeholder="Enter city"
                      value={formData.registeredAddress.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registeredAddress.state">State</Label>
                    <Input
                      id="registeredAddress.state"
                      placeholder="Enter state"
                      value={formData.registeredAddress.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registeredAddress.pincode">Pincode</Label>
                  <Input
                    id="registeredAddress.pincode"
                    placeholder="Enter pincode"
                    value={formData.registeredAddress.pincode}
                    onChange={handleChange}
                    required
                    maxLength={6}
                    pattern="\d{6}"
                  />
                </div>
              </div>
            </div>

            {/* Warehouse Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                <h3 className="font-semibold">Warehouse Address</h3>
              </div>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="warehouseAddress.street">Street Address</Label>
                  <Input
                    id="warehouseAddress.street"
                    placeholder="Enter street address"
                    value={formData.warehouseAddress.street}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="warehouseAddress.city">City</Label>
                    <Input
                      id="warehouseAddress.city"
                      placeholder="Enter city"
                      value={formData.warehouseAddress.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouseAddress.state">State</Label>
                    <Input
                      id="warehouseAddress.state"
                      placeholder="Enter state"
                      value={formData.warehouseAddress.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="warehouseAddress.pincode">Pincode</Label>
                  <Input
                    id="warehouseAddress.pincode"
                    placeholder="Enter pincode"
                    value={formData.warehouseAddress.pincode}
                    onChange={handleChange}
                    required
                    maxLength={6}
                    pattern="\d{6}"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </div>

      {/* Fixed Footer with Submit Button */}
      <div className="sticky bottom-0 bg-white border-t p-4 mt-auto">
        <Button 
          type="submit"
          form="registrationForm"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Registration...
            </>
          ) : (
            "Submit Registration"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SignupForm;