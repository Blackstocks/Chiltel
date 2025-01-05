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
	NotepadText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import ActiveService from "./ActiveService";

const OverviewTab = () => {
	const { profile, loading, error } = useProfile();

	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error loading your profile</div>;
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{/* Stats Cards */}
			<Card>
				<CardHeader>
					<CardTitle className="text-sm font-medium">
						Today's Earnings
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">₹ 0</div>
					{/* <p className="text-xs text-gray-500">+12% from yesterday</p> */}
				</CardContent>
			</Card>

			{profile?.balance > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">Balance</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="text-2xl font-bold">₹ {profile.balance || 0}</div>
							<p className="text-sm text-muted-foreground">Total Balance</p>
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
							<div className="text-2xl font-bold">{profile.services.total}</div>
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
							<div className="text-2xl font-bold">{profile.rating.average}</div>
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
		if (currService?.userLocation?.coordinates) {
			window.open(
				`https://www.google.com/maps/dir/?api=1&destination=${currService.userLocation.coordinates[0]},${currService.userLocation.coordinates[0]}`,
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
