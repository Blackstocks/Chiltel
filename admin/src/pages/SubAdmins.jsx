// pages/SubAdminManagement.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SubAdminManagement = () => {
  const navigate = useNavigate();
  const [subAdmins, setSubAdmins] = useState([]);

  const fetchSubAdmins = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/sub-admins`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSubAdmins(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch sub-admins"
      );
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/sub-admin/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Sub-admin deleted successfully");
      fetchSubAdmins();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete sub-admin"
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sub-Admins List</CardTitle>
          <Button onClick={() => navigate("/register")}>
            Register New Sub-Admin
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subAdmins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.username}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phoneNumber}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(admin._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubAdminManagement;
