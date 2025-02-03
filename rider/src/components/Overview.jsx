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

const OverviewTab = () => {
	const { profile, loading, error } = useProfile();

	if (loading) {
		return <Loader />;
	}
	if (error) {
		return <div>Error loading your profile</div>;
	}

	return (
		<div className="space-y-6">
			{/* Earnings Section */}
			<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="p-6">
					<h3 className="text-lg font-semibold leading-none tracking-tight">
						Earnings Overview
					</h3>
					<div className="mt-6 grid gap-6 md:grid-cols-3">
						{/* Total Earnings Card */}
						<div className="rounded-xl bg-green-50 p-4">
							<div className="flex items-center gap-2">
								<div className="rounded-full bg-green-100 p-2">
									<IndianRupee className="h-4 w-4 text-green-600" />
								</div>
								<p className="text-sm font-medium text-green-600">
									Total Earnings
								</p>
							</div>
							<div className="mt-3">
								<h4 className="text-2xl font-bold text-green-700">
									₹{" "}
									{profile.earning.reduce((total, e) => total + e.amount, 0) ||
										0}
								</h4>
								<p className="text-xs text-green-600">Lifetime earnings</p>
							</div>
						</div>

						{/* Monthly Earnings Card */}
						<div className="rounded-xl bg-blue-50 p-4">
							<div className="flex items-center gap-2">
								<div className="rounded-full bg-blue-100 p-2">
									<CalendarDays className="h-4 w-4 text-blue-600" />
								</div>
								<p className="text-sm font-medium text-blue-600">
									Monthly Earnings
								</p>
							</div>
							<div className="mt-3">
								<h4 className="text-2xl font-bold text-blue-700">
									₹{" "}
									{profile.earning
										.filter(
											(e) =>
												new Date(e.date).getMonth() === new Date().getMonth() &&
												new Date(e.date).getFullYear() ===
													new Date().getFullYear()
										)
										.reduce((total, e) => total + e.amount, 0) || 0}
								</h4>
								<p className="text-xs text-blue-600">This month's total</p>
							</div>
						</div>

						{/* Today's Earnings Card */}
						<div className="rounded-xl bg-purple-50 p-4">
							<div className="flex items-center gap-2">
								<div className="rounded-full bg-purple-100 p-2">
									<Clock className="h-4 w-4 text-purple-600" />
								</div>
								<p className="text-sm font-medium text-purple-600">
									Today's Earnings
								</p>
							</div>
							<div className="mt-3">
								<h4 className="text-2xl font-bold text-purple-700">
									₹{" "}
									{profile.earning
										.filter(
											(e) =>
												new Date(e.date).toDateString() ===
												new Date().toDateString()
										)
										.reduce((total, e) => total + e.amount, 0) || 0}
								</h4>
								<p className="text-xs text-purple-600">Earned today</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Rest of the Stats Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{profile?.balance > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="text-sm font-medium">Coins</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="text-2xl font-bold">
									🪙 {profile.balance / 10 || 0}
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
												>
													<Info className="h-4 w-4 text-gray-500" />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>
													Your ₹2000 is converted into 200 coins & 5 coins will
													be deducted if you complete one service
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								<p className="text-sm text-muted-foreground">Total Coins</p>
							</div>
						</CardContent>
					</Card>
				)}

				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">
							Services Overview
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<div className="text-2xl font-bold">
									{profile.services.total}
								</div>
								<p className="text-sm text-muted-foreground">Total Services</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<div className="text-xl font-semibold text-yellow-600">
										{profile.services.total - profile.services.completed}
									</div>
									<p className="text-sm text-muted-foreground">Pending</p>
								</div>

								<div>
									<div className="text-xl font-semibold text-green-600">
										{profile.services.completed}
									</div>
									<p className="text-sm text-muted-foreground">Completed</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">Rating</CardTitle>
					</CardHeader>
					<CardContent>
						{profile.rating.count > 0 ? (
							<>
								<div className="text-2xl font-bold">
									{profile.rating.average}
								</div>
								<p className="text-xs text-gray-500">
									Based on {profile.rating.count}{" "}
									{profile.rating.count > 1 ? "ratings" : "rating"}
								</p>
							</>
						) : (
							<p className="text-xs text-gray-500">No reviews yet</p>
						)}
					</CardContent>
				</Card>

				{/* Active Service Card */}
				{<CurrCard />}
			</div>
		</div>
	);
};

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
			<div className="text-center text-gray-500 mt-4">Loading services...</div>
		);
	}

	console.log(currServices);

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
		if (currService?.userLocation?.coordinates) {
			window.open(
				`https://www.google.com/maps/dir/?api=1&destination=${currService.userLocation.coordinates[0]},${currService.userLocation.coordinates[1]}`,
				"_blank"
			);
		}
	};
	return (
		<>
			{<ActiveService />}
			<Separator className="md:col-span-2 lg:col-span-3" />
			<Card className="md:col-span-2 lg:col-span-3">
				<CardHeader>
					<CardTitle>Accepted Services</CardTitle>
					<CardDescription>Active service details</CardDescription>
				</CardHeader>
				{!currServices && error ? (
					<CardDescription className="text-center m-2">{error}</CardDescription>
				) : (
					currServices &&
					currServices?.map((currService, index) => (
						<CardContent className="space-y-6" key={currService._id}>
							<CardTitle>Service #{index + 1}</CardTitle>
							{/* Customer Details */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<MapPin className="h-4 w-4 text-muted-foreground" />
										<span>{currService?.userLocation?.address}</span>
									</div>
									<Button
										variant="outline"
										onClick={() => handleNavigate(currService)}
										className="flex items-center space-x-2"
									>
										<Navigation className="h-4 w-4" />
										<span>Navigate</span>
									</Button>
								</div>

								{/* <div className="flex items-center space-x-2">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span>{currService?.user?.phone}</span>
								</div> */}

								<div className="flex items-center space-x-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span>
										Estimated Duration: {currService?.service.estimatedDuration}
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<Package className="w-4 h-4" />
									<span>Service: {currService?.service.name}</span>
								</div>
								<div className="flex items-center space-x-2">
									<IndianRupee className="w-4 h-4" />
									<span>Price: {currService?.price}</span>
								</div>
								<div className="flex items-center space-x-2">
									<NotepadText className="w-4 h-4" />
									<span>Note: {currService?.remarks}</span>
								</div>
							</div>
							<Button
								onClick={() => handleStartService(currService._id)}
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Starting...
									</>
								) : (
									"Start Service"
								)}
							</Button>
						</CardContent>
					))
				)}
			</Card>
		</>
	);
};

export default OverviewTab;
