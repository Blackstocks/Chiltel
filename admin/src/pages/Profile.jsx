// pages/Profile.jsx
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';

const Profile = () => {
 const { token, admin } = useAuth();
 const [profile, setProfile] = useState({
   username: admin.username,
   email: admin.email,
   phoneNumber: admin.phoneNumber,
   currentPassword: admin.password,
   newPassword: ''
 });
 const [showPassword, setShowPassword] = useState(false);
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
   try {
     await axios.put(
       `${import.meta.env.VITE_BACKEND_URL}/api/admin/profile`,
       profile,
       { headers: { Authorization: `Bearer ${token}` }}
     );
     toast.success('Profile updated successfully');
   } catch (error) {
     toast.error(error.response?.data?.message || 'Update failed');
   } finally {
     setLoading(false);
   }
 };

 return (
   <Card className="max-w-2xl mx-auto">
     <CardHeader>
       <CardTitle>Profile Settings</CardTitle>
     </CardHeader>
     <CardContent>
       <form onSubmit={handleSubmit} className="space-y-4">
         <div>
           <Label>Username</Label>
           <Input
             value={profile.username}
             onChange={(e) => setProfile({...profile, username: e.target.value})}
           />
         </div>

         <div>
           <Label>Email</Label>
           <Input
             type="email"
             value={profile.email}
             onChange={(e) => setProfile({...profile, email: e.target.value})}
           />
         </div>

         <div>
           <Label>Phone Number</Label>
           <Input
             value={profile.phoneNumber}
             onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
           />
         </div>

         <div>
           <Label>Current Password</Label>
           <div className="relative">
             <Input
               type={showPassword ? "text" : "password"}
               value={profile.currentPassword}
               onChange={(e) => setProfile({...profile, currentPassword: e.target.value})}
             />
             <button
               type="button"
               className="absolute right-3 top-1/2 -translate-y-1/2"
               onClick={() => setShowPassword(!showPassword)}
             >
               {showPassword ? (
                 <EyeOff className="h-4 w-4 text-gray-500" />
               ) : (
                 <Eye className="h-4 w-4 text-gray-500" />
               )}
             </button>
           </div>
         </div>

         <div>
           <Label>New Password</Label>
           <div className="relative">
             <Input
               type={showPassword ? "text" : "password"}
               value={profile.newPassword}
               onChange={(e) => setProfile({...profile, newPassword: e.target.value})}
             />
             <button
               type="button"
               className="absolute right-3 top-1/2 -translate-y-1/2"
               onClick={() => setShowPassword(!showPassword)}
             >
               {showPassword ? (
                 <EyeOff className="h-4 w-4 text-gray-500" />
               ) : (
                 <Eye className="h-4 w-4 text-gray-500" />
               )}
             </button>
           </div>
         </div>

         <Button type="submit" disabled={loading}>
           {loading ? 'Updating...' : 'Update Profile'}
         </Button>
       </form>
     </CardContent>
   </Card>
 );
};

export default Profile;