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

const OverviewTab = () => {
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
					<div className="text-2xl font-bold">$124.50</div>
					<p className="text-xs text-gray-500">+12% from yesterday</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-sm font-medium">
						Completed Services
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">8</div>
					<p className="text-xs text-gray-500">Today's completion</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-sm font-medium">Rating</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">4.8</div>
					<p className="text-xs text-gray-500">Based on 150 reviews</p>
				</CardContent>
			</Card>

			{/* Active Service Card */}
			{<CurrCard />}
		</div>
	);
};

const CurrCard = () => {
	const { getCurrentService, loading, error, completeService } = useServices();
	const [currService, setCurrService] = useState(null);
	useEffect(() => {
		getCurrentService().then((service) => {
			setCurrService(service);
		});
	}, []);

	console.log(currService);
	if (loading) {
		return (
			<div className="text-center text-gray-500 mt-4">Loading services...</div>
		);
	}

	return (
		<Card className="md:col-span-2 lg:col-span-3">
			<CardHeader>
				<CardTitle>Current Service</CardTitle>
				<CardDescription>Active service details</CardDescription>
			</CardHeader>
			{!currService && error ? (
				<CardDescription className="text-center m-2">{error}</CardDescription>
			) : (
				<>
					<CardContent>
						<div className="flex items-center space-x-4">
							<MapPin className="w-6 h-6 text-blue-500" />
							<div>
								<p className="font-medium">
									{currService.userLocation.address}
								</p>
								<p className="text-sm text-gray-500">
									Service: {currService.service.name}
								</p>
							</div>
						</div>
					</CardContent>
					<CardFooter className="justify-between">
						<Button variant="outline">Navigate</Button>
						<Button onClick={() => completeService(currService._id)}>
							Complete Service
						</Button>
					</CardFooter>
				</>
			)}
		</Card>
	);
};

export default OverviewTab;
