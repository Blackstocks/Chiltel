import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Copy,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";



// Full component with API integration
const ReferralCodeDialog = () => {
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);

  const generateReferralCode = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
  
    setIsGenerating(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/referralCode/generate`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (response.data.success) {
        setReferralCode(response.data.data.referralCode);
        setExpiresAt(response.data.data.expiresAt);
        
        const isExisting = response.data.message.includes('Existing');
        toast.success(isExisting ? 
          "Referral code already exists for this email" : 
          "Referral code generated successfully"
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate referral code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied to clipboard");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Generate Referral Code</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Referral Code</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {referralCode && (
            <div className="space-y-2">
              <Label>Referral Code</Label>
              <div className="flex items-center space-x-2">
                <Input readOnly value={referralCode} className="font-mono" />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyReferralCode}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                This code will expire in 24 hours
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={generateReferralCode} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              "Generate Code"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralCodeDialog;
