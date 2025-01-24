import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Send } from "lucide-react";

const CompleteBtn = ({ loading }) => {
	const [showVerifyModal, setShowVerifyModal] = useState(false);
	const [happyCode, setHappyCode] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [isSendingOTP, setIsSendingOTP] = useState(false);

	const handleSendOTP = async () => {
		try {
			setIsSendingOTP(true);
			// Add your OTP sending logic here
			// await sendOTP();
			// Show success message or toast
		} catch (error) {
			console.error("Error sending OTP:", error);
			// Show error message or toast
		} finally {
			setIsSendingOTP(false);
		}
	};

	const handleVerifyAndComplete = async () => {
		try {
			setIsVerifying(true);
			// Add your verification logic here
			// if verification successful:
			// await handleCompleteWork();
			setShowVerifyModal(false);
		} catch (error) {
			console.error("Error verifying code:", error);
			// Show error message or toast
		} finally {
			setIsVerifying(false);
		}
	};
	return (
		<>
			<Button
				onClick={() => setShowVerifyModal(true)}
				disabled={loading}
				size="lg"
				className="bg-green-600 hover:bg-green-700 text-white"
			>
				{loading ? (
					<>
						<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						Completing...
					</>
				) : (
					<>
						<CheckCircle2 className="h-4 w-4 mr-2" />
						Complete Work
					</>
				)}
			</Button>

			<Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Enter Happy Code to Complete Work</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-4">
						<div className="flex gap-2">
							<Input
								type="text"
								placeholder="Enter Happy Code"
								value={happyCode}
								onChange={(e) => setHappyCode(e.target.value)}
							/>
							<Button
								variant="outline"
								onClick={handleSendOTP}
								disabled={isSendingOTP}
							>
								{isSendingOTP ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<>
										<Send className="h-4 w-4" />
										Send OTP
									</>
								)}
							</Button>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={handleVerifyAndComplete}
							disabled={isVerifying || !happyCode}
							className="bg-green-600 hover:bg-green-700 text-white"
						>
							{isVerifying ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Verifying...
								</>
							) : (
								"Verify & Complete"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default CompleteBtn;

// Replace your existing button with this:
