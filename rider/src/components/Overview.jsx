import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useEffect, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import EarningsOverview from "./ui/earningOverview";
import {
	CheckCircle2,
	Clock,
	Navigation,
	Phone,
	Plus,
	Package,
	IndianRupee,
	CalendarDays,
	Info,
	NotepadText,
	TrendingUp,
	ArrowUpRight,
	ArrowDownRight,
	Wallet,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import ActiveService from "./ActiveService";
import Loader from "./Loader";
import { toast } from "react-toastify";
import axios from "axios";

const OverviewTab = () => {
	const { profile, loading, error } = useProfile();

	if (loading) {
		return <Loader />;
	}
	if (error) {
		return <div>Error loading your profile</div>;
	}

	// Calculate current month's earnings
	const currentMonthEarnings = profile.earning
		.filter(
			(e) =>
				new Date(e.date).getMonth() === new Date().getMonth() &&
				new Date(e.date).getFullYear() === new Date().getFullYear()
		)
		.reduce((total, e) => total + e.amount, 0);

	// Calculate last month's earnings
	const lastMonthEarnings = profile.earning
		.filter(
			(e) =>
				new Date(e.date).getMonth() === new Date().getMonth() - 1 &&
				new Date(e.date).getFullYear() === new Date().getFullYear()
		)
		.reduce((total, e) => total + e.amount, 0);

	// Calculate percentage change
	const percentageChange = lastMonthEarnings
		? ((currentMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100
		: 0;

	const initPay = (order) => {
		const options = {
			key: import.meta.env.VITE_RAZORPAY_KEY_ID,
			amount: order.amount,
			currency: order.currency,
			name: "Recharge Wallet",
			description: "Recharge your wallet to continue using the platform",
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
						import.meta.env.VITE_BACKEND_URL + "/rider/verify-recharge",
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
	};

	const handlePayment = async () => {
		// Add payment logic here
		const { data } = await axios.post(
			import.meta.env.VITE_BACKEND_URL + "/rider/create-order"
		);
		console.log("order data: ", data);
		return data;
	};

	const handleRecharge = async () => {
		const order = await handlePayment();
		if (order) {
			initPay(order);
		}
	};

	return (
		<div className="space-y-8">
			{/* Earnings Section */}
			<EarningsOverview
				profile={profile}
				currentMonthEarnings={currentMonthEarnings}
				percentageChange={percentageChange}
			/>

			{/* Stats Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{/* Coins Card */}
				{profile?.balance > 0 && (
					<Card
						className={`transition-all duration-200 hover:shadow-lg ${
							profile.balance < 100 ? "bg-red-100" : ""
						}`}
					>
						<CardHeader>
							<CardTitle className="flex items-center justify-between text-sm font-medium">
								Coins Balance
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="w-6 h-6 p-0 rounded-full hover:bg-gray-100"
											>
												<Info className="w-4 h-4 text-gray-500" />
											</Button>
										</TooltipTrigger>
										<TooltipContent className="max-w-xs p-4 space-y-2 bg-gray-900">
											<div className="space-y-3">
												<div>
													<h4 className="mb-1 text-sm font-semibold text-white">
														Coin System
													</h4>
													<div className="space-y-1 text-xs text-gray-300">
														<p className="flex items-center gap-2">
															<span className="text-yellow-400">🪙</span>
															₹2000 = 200 coins initial balance
														</p>
														<p className="flex items-center gap-2">
															<span className="text-yellow-400">🪙</span>5 coins
															deducted per service
														</p>
													</div>
												</div>

												<div>
													<h4 className="mb-1 text-sm font-semibold text-white">
														How it works
													</h4>
													<ul className="pl-4 space-y-1 text-xs text-gray-300 list-disc">
														<li>
															Coins are automatically deducted when a service is
															completed
														</li>
														<li>
															You can recharge coins through the wallet section
														</li>
														<li>Minimum balance required: 5 coins</li>
													</ul>
												</div>

												<div className="pt-1 text-xs text-gray-400 border-t border-gray-700">
													Contact support for more information about the coin
													system
												</div>
											</div>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-2xl font-bold">
									{profile.balance / 10 || 0}
								</div>
								<p className="text-sm text-muted-foreground">
									Available for services
								</p>

								{profile.balance < 100 && (
									<>
										<p className="text-sm text-red-500">
											Low balance! Recharge now to continue using the platform
										</p>
										<Button className="mt-2" onClick={handleRecharge}>
											Recharge Now
										</Button>
									</>
								)}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Services Overview Card */}
				<Card className="transition-all duration-200 hover:shadow-lg">
					<CardHeader>
						<CardTitle className="text-sm font-medium">
							Services Overview
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<div className="text-2xl font-bold text-gray-800">
									{profile.services.total}
								</div>
								<p className="text-sm text-muted-foreground">Total Services</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="p-3 rounded-lg bg-yellow-50">
									<div className="text-xl font-semibold text-yellow-600">
										{profile.services.total - profile.services.completed}
									</div>
									<p className="text-sm text-yellow-600">Pending</p>
								</div>

								<div className="p-3 rounded-lg bg-green-50">
									<div className="text-xl font-semibold text-green-600">
										{profile.services.completed}
									</div>
									<p className="text-sm text-green-600">Completed</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Rating Card */}
				<Card className="transition-all duration-200 hover:shadow-lg">
					<CardHeader>
						<CardTitle className="text-sm font-medium">
							Performance Rating
						</CardTitle>
					</CardHeader>
					<CardContent>
						{profile.rating.count > 0 ? (
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-2xl font-bold text-gray-800">
									{profile.rating.average}
									<span className="text-yellow-400">★</span>
								</div>
								<p className="text-sm text-gray-500">
									Based on {profile.rating.count}{" "}
									{profile.rating.count > 1 ? "ratings" : "rating"}
								</p>
							</div>
						) : (
							<div className="py-4 text-center">
								<p className="text-sm text-gray-500">No reviews yet</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Active Service Section */}
			{<ActiveService />}
			<Separator className="my-8" />
			<CurrCard />
		</div>
	);
};

// CurrCard component remains the same
const CurrCard = () => {
	const {
		getAcceptedServices,
		loading,
		error,
		addExtraWorks,
		startService,
		startWorking,
	} = useServices();
	const [currServices, setCurrServices] = useState(null);

	useEffect(() => {
		getAcceptedServices().then((service) => {
			setCurrServices(service);
		});
	}, []);

	if (loading) {
		return (
			<div className="mt-4 text-center text-gray-500">Loading services...</div>
		);
	}

	const handleStartService = async (serviceId) => {
		try {
			await startService(serviceId);
			window.location.reload();
		} catch (err) {
			console.error(err);
		}
	};

	// Function to open navigation
	const handleNavigate = (currService) => {
		console.log(currService);
		if (currService?.userLocation?.address) {
			window.open(
				`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
					currService.userLocation.address
				)}`,
				"_blank"
			);
		}
	};
	return (
		<>
			{/* {<ActiveService />}
			<Separator className="md:col-span-2 lg:col-span-3" /> */}
			<Card className="md:col-span-2 lg:col-span-3">
				<CardHeader>
					<CardTitle>Accepted Services</CardTitle>
					<CardDescription>Active service details</CardDescription>
				</CardHeader>
				{!currServices && error ? (
					<CardDescription className="m-2 text-center">{error}</CardDescription>
				) : (
					currServices &&
					currServices?.map((currService, index) => (
						<CardContent className="space-y-6" key={currService._id}>
							<CardTitle>Service #{index + 1}</CardTitle>
							{/* Customer Details */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<MapPin className="w-4 h-4 text-muted-foreground" />
										<span>{currService?.userLocation?.address}</span>
									</div>
									<Button
										variant="outline"
										onClick={() => handleNavigate(currService)}
										className="flex items-center space-x-2"
									>
										<Navigation className="w-4 h-4" />
										<span>Navigate</span>
									</Button>
								</div>

								<div className="flex items-center space-x-3">
									<div className="p-2 bg-gray-200 rounded-full">
										<Clock className="w-4 h-4 text-gray-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Duration
										</p>
										<p className="text-sm text-gray-600">
											{currService?.services
												.map(
													(serviceDetail) =>
														serviceDetail.serviceId.estimatedDuration
												)
												.join(", ")}
										</p>
									</div>
								</div>

								<div className="flex items-center space-x-3">
									<div className="p-2 bg-gray-200 rounded-full">
										<Package className="w-4 h-4 text-gray-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">
											Service Type
										</p>
										<p className="text-sm text-gray-600">
											{currService?.services
												.map((serviceDetail) => serviceDetail.serviceId.name)
												.join(", ")}
										</p>
									</div>
								</div>

								<div className="flex items-center space-x-3">
									<div className="p-2 bg-gray-200 rounded-full">
										<IndianRupee className="w-4 h-4 text-gray-600" />
									</div>
									<div>
										<p className="text-sm font-medium text-gray-700">Price</p>
										<p className="text-sm text-gray-600">
											₹{currService?.price}
										</p>
									</div>
								</div>

								{currService?.remarks && (
									<div className="flex items-center space-x-3">
										<div className="p-2 bg-gray-200 rounded-full">
											<NotepadText className="w-4 h-4 text-gray-600" />
										</div>
										<div>
											<p className="text-sm font-medium text-gray-700">
												Additional Notes
											</p>
											<p className="text-sm text-gray-600">
												{currService?.remarks}
											</p>
										</div>
									</div>
								)}
							</div>

							{/* Action Buttons */}
							<div className="flex justify-end pt-4">
								<Button
									onClick={() => handleStartService(currService._id)}
									disabled={loading}
									className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200 min-w-[150px]"
								>
									{loading ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Starting...
										</>
									) : (
										<>
											<CheckCircle2 className="w-4 h-4 mr-2" />
											Start Service
										</>
									)}
								</Button>
							</div>
						</CardContent>
					))
				)}
			</Card>
		</>
	);
};

export default OverviewTab;
