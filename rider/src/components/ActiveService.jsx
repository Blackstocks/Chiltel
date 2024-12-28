// src/components/ActiveService.jsx
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CardFooter } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useServices } from "@/hooks/useServices";

const ActiveService = () => {
	const [activeService, setActiveService] = useState(null);

	const { getActiveService, loading, error, completeService } = useServices();

	useEffect(() => {
		getActiveService().then((service) => {
			console.log(service);
			setActiveService(service);
		});
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex justify-between items-center">
					<span>Active Service </span>
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
				</CardTitle>
			</CardHeader>

			{!error && (
				<div key={activeService._id}>
					<CardContent>
						<div className="flex items-center space-x-4">
							<MapPin className="w-6 h-6 text-blue-500" />
							<div>
								<p className="font-medium">
									{activeService?.userLocation?.address}
								</p>
								<p className="text-sm text-gray-500">
									Service: {activeService.service.name}
								</p>
							</div>
						</div>
					</CardContent>
					<CardFooter className="justify-between">
						<Button variant="outline">Navigate</Button>
						<Button onClick={() => completeService(activeService._id)}>
							Complete Service
						</Button>
					</CardFooter>
				</div>
			)}
		</Card>
	);
};

export default ActiveService;
