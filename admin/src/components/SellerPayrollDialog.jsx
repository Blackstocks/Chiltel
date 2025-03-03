import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";


const SellerPayrollDialog = ({ seller, isOpen, onClose, onSave }) => {
  const [commission, setCommission] = useState(seller?.commissionRate || 0);
  const totalAmount = seller?.payroll?.totalAmount || 0;
  const adminCommission = (totalAmount * (commission / 100)).toFixed(2);
  const sellerEarnings = (totalAmount - adminCommission).toFixed(2);


  const handleSave = async () => { 
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/update-commision/${seller._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ commissionRate: commission }),
        }
      );

      if (!response.ok) throw new Error("Failed to update commission");

      onSave(commission);
      onClose();
      toast.success("Commission updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payroll Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label>Commission Percentage</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                min="0"
                max="100"
                step="0.1"
                className="w-32"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellerPayrollDialog;