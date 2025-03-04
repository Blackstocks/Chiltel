import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, MapPin, Package, IndianRupee, NotepadText } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { getTimeDiffString } from "@/utils/formatters";

const ServicesTab = () => {
	const { services, loading, acceptService, declineService } = useServices();

	if (loading) {
		return (
			<div className="text-center text-gray-500 mt-4">Loading services...</div>
		);
	}

	if (services.length === 0) {
		return (
			<div className="text-center text-gray-500 mt-4">
				No service request available
			</div>
		);
	}
	console.log(services);

	return (
		<ScrollArea className="h-[600px] rounded-md border p-4">
			{/* Pending Services */}
			{services &&
				services.map((service, index) => (
					<Card key={service._id} className="mb-4">
						<CardHeader>
							<div className="flex justify-between items-center">
								<CardTitle>Service Request #{index + 1}</CardTitle>
								<Badge>New Request</Badge>
							</div>
							<CardDescription>
								Posted {getTimeDiffString(service.createdAt)} ago
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="flex items-center space-x-2">
									<MapPin className="w-4 h-4" />
									<span>{service.userLocation.address}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Clock className="w-4 h-4" />
									<span>
										Estimated time:{" "}
										{service.services
											.map(
												(serviceDetail) =>
													serviceDetail.serviceId.estimatedDuration
											)
											.join(", ")}
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<Package className="w-4 h-4" />
									<span>
										Services:{" "}
										{service.services
											.map((serviceDetail) => serviceDetail.serviceId.name)
											.join(", ")}
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<IndianRupee className="w-4 h-4" />
									<span>Price: {service.price}</span>
								</div>
								<div className="flex items-center space-x-2">
									<NotepadText className="w-4 h-4" />
									<span>Note: {service.remarks}</span>
								</div>
							</div>
						</CardContent>
						<CardFooter className="justify-end space-x-2">
							<Button
								variant="outline"
								onClick={() => {
									declineService(service._id);
									setTimeout(() => {
										window.location.reload();
									}, 500);
								}}
							>
								Decline
							</Button>
							<Button
								onClick={async () => {
									await acceptService(service._id);
									setTimeout(() => {
										window.location.reload();
									}, 500);
								}}
							>
								Accept Service
							</Button>
						</CardFooter>
					</Card>
				))}
		</ScrollArea>
	);
};

export default ServicesTab;
