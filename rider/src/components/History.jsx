import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, MapPin, Package, User } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useEffect, useState } from "react";
import { formatDate } from "../utils/formatters";

const HistoryTab = () => {
	const { getServiceHistory, loading, error } = useServices();
	const [history, setHistory] = useState([]);

	useEffect(() => {
		const fetchHistory = async () => {
			const response = await getServiceHistory();
			setHistory(response);
		};
		fetchHistory();
	}, []);

	if (loading) {
		return (
			<div className="text-center text-gray-500 mt-4">Loading services...</div>
		);
	}

	if (error) {
		return (
			<div className="text-center text-gray-500 mt-4">
				Error loading services
			</div>
		);
	}

	if (history.length === 0) {
		return (
			<div className="text-center text-gray-500 mt-4">
				No completed service available
			</div>
		);
	}

	console.log(history);

	return (
		<ScrollArea className="h-[600px] rounded-md border p-4">
			{history.services.map((service, index) => (
				<Card key={service._id} className="mb-4">
					<CardHeader>
						<div className="flex justify-between items-center">
							<CardTitle>Service #{index + 1}</CardTitle>
							<Badge variant="outline" className="bg-green-50">
								Completed
							</Badge>
						</div>
						<CardDescription>
							Completed on {formatDate(service.completedAt)}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<User className="w-4 h-4" />
								<span>{service.user.name}</span>
							</div>
							<div className="flex items-center space-x-2">
								<MapPin className="w-4 h-4" />
								<span>{service.userLocation.address}</span>
							</div>
							<div className="flex items-center space-x-2">
								<Package className="w-4 h-4" />
								<span>Service: {service.service.name}</span>
							</div>
							<div className="flex items-center space-x-2">
								<CheckCircle2 className="w-4 h-4 text-green-500" />
								<span>Rating: 5.0</span>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</ScrollArea>
	);
};

export default HistoryTab;
