import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Settings, Menu, Bell, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"; // Import Dialog component

import ProfileTab from "@/components/Profile";
import ServicesTab from "@/components/Services";
import OverviewTab from "@/components/Overview";
import HistoryTab from "@/components/History";
import { useAuthActions } from "@/hooks/useAuthActions";
import AttendanceCalendar from "../components/AttendanceCalender";
import { useProfile } from "../hooks/useProfile";
import axios from "axios";
import { toast } from "react-toastify";

const RiderDashboard = () => {
	const { logout } = useAuthActions();
	const { profile, loading, error } = useProfile();
	const [activeTab, setActiveTab] = useState("overview");
	const [isOnline, setIsOnline] = useState(true);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const initPay = (order) => {
		const options = {
			key: import.meta.env.VITE_RAZORPAY_KEY_ID,
			amount: order.amount,
			currency: order.currency,
			name: "Security Deposit",
			description: "Security Deposit for Rider",
			order_id: order.id,
			receipt: order.receipt,
			config: {
				display: {
					// Payment method specific blocks
					blocks: {
						utib: {
							//name for AXIS block
							name: "Pay using AXIS Bank",
							instruments: [
								{ method: "card" },
								{ method: "netbanking" },
								{ method: "upi" },
							],
						},
						other: {
							//  name for other block
							name: "Other Payment modes",
							instruments: [
								{ method: "card" },
								{ method: "netbanking" },
								{ method: "upi" },
							],
						},
					},
					sequence: ["block.utib", "block.other"],
					preferences: {
						show_default_cards: true,
						show_saved_cards: true,
						show_default_emi: true,
					},
					// Customize EMI section
					emi: {
						banks: ["HDFC", "ICICI", "Kotak"],
						duration: {
							min: 3,
							max: 12,
						},
					},
					// UPI customization
					upi: {
						flow: "collect",
						apps: ["google_pay", "phonepe", "paytm", "upi"],
					},
				},
			},
			handler: async (response) => {
				console.log("init pay: ", response);
				try {
					response.mode = "recharge";
					const { data } = await axios.post(
						import.meta.env.VITE_BACKEND_URL + "/rider/verify-deposit-payment",
						response,
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem("riderToken")}`,
							},
						}
					);
					console.log("transaction data: ", data);
					if (data.success) {
						console.log("order info: ", data.message);
						window.location.reload();
						toast.success(res.message);
					} else {
						toast.error("Payment failed. Please try again.");
					}
				} catch (error) {
					console.log(error);
					toast.error(error);
				}
			},
		};
		const rzp = new window.Razorpay(options);
		rzp.open();
		document.querySelector(".razorpay-container").style.pointerEvents = "auto";
	};

	const handlePayment = async () => {
		// Add payment logic here
		const { data } = await axios.post(
			import.meta.env.VITE_BACKEND_URL + "/rider/create-deposit-order"
		);
		console.log("order data: ", data);
		return data;
	};

	const handleSecurityDepositPayment = async () => {
		const order = await handlePayment();
		if (order) {
			initPay(order);
		}
	};

	useEffect(() => {
		if (profile && !profile.securityDeposit.isPaid) {
			setIsDialogOpen(true);
		}
	}, [profile]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
			{/* Security Deposit Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={() => {}}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Security Deposit Required</DialogTitle>
						<DialogDescription>
							Please pay the security deposit of ₹3000 to continue using the
							platform.
						</DialogDescription>
					</DialogHeader>
					<Button className="mt-6" onClick={handleSecurityDepositPayment}>
						Pay Now
					</Button>
				</DialogContent>
			</Dialog>

			{/* Mobile Navigation Drawer */}
			<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
				<SheetContent side="left" className="w-64 p-0 bg-white">
					<div className="flex flex-col h-full">
						<div className="p-4 border-b border-gray-100">
							<div className="flex items-center space-x-3">
								<Avatar className="w-10 h-10">
									<AvatarImage
										src="/placeholder-avatar.jpg"
										alt="User avatar"
									/>
									<AvatarFallback className="text-indigo-600 bg-indigo-100">
										RD
									</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="font-semibold text-gray-800">Rider Name</h3>
									<p className="text-sm text-gray-500">ID: #12345</p>
								</div>
							</div>
						</div>
						<ScrollArea className="flex-1 border-b border-gray-100">
							<div className="p-4 space-y-4">
								{[
									"Overview",
									"Services",
									"History",
									"Attendance",
									"Profile",
								].map((item) => (
									<Button
										key={item}
										variant="ghost"
										className="justify-start w-full font-normal text-left hover:bg-indigo-50 hover:text-indigo-600"
										onClick={() => {
											setActiveTab(item.toLowerCase());
											setIsMobileMenuOpen(false);
										}}
									>
										{item}
									</Button>
								))}
							</div>
						</ScrollArea>
						<div className="p-4">
							<Button
								variant="destructive"
								className="w-full bg-red-500 hover:bg-red-600"
								onClick={logout}
							>
								Log Out
							</Button>
						</div>
					</div>
				</SheetContent>
			</Sheet>

			{/* Header */}
			<header className="sticky top-0 z-50 bg-white border-b border-indigo-100 shadow-lg">
				<div className="px-4 py-4 mx-auto max-w-7xl">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								size="icon"
								className="lg:hidden hover:bg-indigo-50"
								onClick={() => setIsMobileMenuOpen(true)}
							>
								<Menu className="w-6 h-6 text-indigo-600" />
							</Button>
							<div className="flex items-center space-x-3">
								<div className="relative hidden sm:block">
									<Avatar className="w-12 h-12 ring-2 ring-indigo-200 ring-offset-2">
										<AvatarImage
											src="/placeholder-avatar.jpg"
											alt="User avatar"
										/>
										<AvatarFallback className="text-indigo-600 bg-indigo-100">
											PD
										</AvatarFallback>
									</Avatar>
									<div className="absolute -bottom-1 -right-1">
										<div
											className={`h-4 w-4 rounded-full border-2 border-white ${
												isOnline ? "bg-green-500" : "bg-red-500"
											}`}
										></div>
									</div>
								</div>
								<div className="space-y-1">
									<div className="flex items-center space-x-2">
										<h2 className="text-lg font-bold text-gray-800 sm:text-xl">
											Partner Dashboard
										</h2>
										<Badge className="hidden text-indigo-700 bg-indigo-100 border-0 sm:inline-flex">
											Pro
										</Badge>
									</div>
									<div className="flex flex-wrap items-center gap-2">
										<Badge
											variant="outline"
											className={`px-3 py-1 text-sm font-medium ${
												isOnline
													? "bg-green-50 text-green-700 border-green-200"
													: "bg-red-50 text-red-700 border-red-200"
											}`}
										>
											{isOnline ? "Online" : "Busy"}
										</Badge>
										<div className="flex items-center space-x-2">
											<Switch
												checked={isOnline}
												onCheckedChange={setIsOnline}
												className="data-[state=checked]:bg-green-500"
												aria-label="Online status toggle"
											/>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="w-8 h-8 p-0 rounded-full hover:bg-indigo-50"
														>
															<Info className="w-5 h-5 text-indigo-500" />
														</Button>
													</TooltipTrigger>
													<TooltipContent className="text-white bg-indigo-800">
														<p>Toggle your availability status</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<Button
								variant="destructive"
								className="items-center hidden gap-2 bg-red-500 md:flex hover:bg-red-600"
								onClick={logout}
							>
								Log Out
							</Button>
							<Button
								variant="destructive"
								size="sm"
								className="bg-red-500 md:hidden hover:bg-red-600"
								onClick={logout}
							>
								Logout
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="px-4 py-6 mx-auto max-w-7xl lg:py-8">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					{/* Desktop Tabs */}
					<div className="hidden px-2 -mx-2 overflow-x-auto sm:block">
						<TabsList className="w-full min-w-full p-1 mb-6 bg-white rounded-lg shadow-md flex-nowrap">
							<TabsTrigger
								value="overview"
								className="flex-1 whitespace-nowrap text-sm font-medium data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all duration-200"
							>
								Overview
							</TabsTrigger>
							<TabsTrigger
								value="services"
								className="flex-1 whitespace-nowrap text-sm font-medium data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all duration-200"
							>
								Services
							</TabsTrigger>
							<TabsTrigger
								value="history"
								className="flex-1 whitespace-nowrap text-sm font-medium data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all duration-200"
							>
								History
							</TabsTrigger>
							<TabsTrigger
								value="attendance"
								className="flex-1 whitespace-nowrap text-sm font-medium data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all duration-200"
							>
								Attendance
							</TabsTrigger>
							<TabsTrigger
								value="profile"
								className="flex-1 whitespace-nowrap text-sm font-medium data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all duration-200"
							>
								Profile
							</TabsTrigger>
						</TabsList>
					</div>

					{/* Mobile Tab Dropdown */}
					<div className="mb-6 sm:hidden">
						<Button
							variant="outline"
							className="items-center justify-between w-full bg-white"
							onClick={() => setIsMobileMenuOpen(true)}
						>
							<span className="capitalize">{activeTab}</span>
							<ChevronDown className="w-4 h-4 opacity-50" />
						</Button>
					</div>

					<div className="w-full max-w-full space-y-6 overflow-x-hidden">
						<TabsContent
							value="overview"
							className="mt-0 animate-in fade-in-50"
						>
							<Card className="p-6 border-indigo-100 shadow-lg bg-white/80 backdrop-blur-sm">
								<div className="min-w-[300px]">
									<OverviewTab />
								</div>
							</Card>
						</TabsContent>
						<TabsContent
							value="services"
							className="mt-0 animate-in fade-in-50"
						>
							<Card className="p-6 border-indigo-100 shadow-lg bg-white/80 backdrop-blur-sm">
								<div className="min-w-[300px]">
									<ServicesTab />
								</div>
							</Card>
						</TabsContent>
						<TabsContent value="history" className="mt-0 animate-in fade-in-50">
							<Card className="p-6 border-indigo-100 shadow-lg bg-white/80 backdrop-blur-sm">
								<div className="min-w-[300px]">
									<HistoryTab />
								</div>
							</Card>
						</TabsContent>
						<TabsContent
							value="attendance"
							className="mt-0 animate-in fade-in-50"
						>
							<Card className="p-6 border-indigo-100 shadow-lg bg-white/80 backdrop-blur-sm">
								<div className="min-w-[300px]">
									<AttendanceCalendar />
								</div>
							</Card>
						</TabsContent>
						<TabsContent value="profile" className="mt-0 animate-in fade-in-50">
							<Card className="p-6 border-indigo-100 shadow-lg bg-white/80 backdrop-blur-sm">
								<div className="min-w-[300px]">
									<ProfileTab />
								</div>
							</Card>
						</TabsContent>
					</div>
				</Tabs>
			</main>
		</div>
	);
};

export default RiderDashboard;
