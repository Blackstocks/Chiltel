import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CardFooter } from "@/components/ui/card";
import { MapPin, Clock, PackageOpen } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import {
	CheckCircle2,
	Loader2,
	Plus,
	AlertCircle,
	Navigation,
	IndianRupee,
	NotepadText,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const ActiveService = () => {
	const [activeService, setActiveService] = useState(null);
	const { getActiveService, loading, error, completeService } = useServices();
	const [extraWorks, setExtraWorks] = useState([]);
	const [showExtraWorkDialog, setShowExtraWorkDialog] = useState(false);
	const [newWorkDescription, setNewWorkDescription] = useState("");
	const [newWorkPrice, setNewWorkPrice] = useState("");
	const [workStarted, setWorkStarted] = useState(false);

	useEffect(() => {
		getActiveService().then((service) => {
			setActiveService(service);
		});
	}, []);

	// Loading skeleton
	if (loading) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>
						<Skeleton className="h-8 w-48" />
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center space-x-4">
						<Skeleton className="h-6 w-6 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-64" />
							<Skeleton className="h-4 w-48" />
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	console.log(activeService);

	const handleStartService = async (serviceId) => {
		// Implementation here
		setWorkStarted(true);
	};

	const handleCompleteWork = async () => {
		// Implementation here
	};

	const handleExtraWorkRequest = async (serviceId) => {
		// Implementation here
		setShowExtraWorkDialog(false);
	};

	return (
		<Card className="md:col-span-2 lg:col-span-3 relative overflow-hidden border-2 border-green-100">
			{/* Active card indicator - subtle gradient background */}
			<div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 pointer-events-none" />

			{/* Glowing active indicator */}
			<div className="absolute top-0 right-0 w-3 h-3 m-4">
				<div className="absolute w-3 h-3 bg-green-400 rounded-full animate-ping" />
				<div className="absolute w-3 h-3 bg-green-500 rounded-full" />
			</div>

			<CardHeader className="border-b relative">
				<div className="flex justify-between items-center">
					<div className="space-y-1">
						<CardTitle className="text-xl font-semibold text-green-800">
							Active Service
						</CardTitle>
						{activeService?._id && (
							<p className="text-sm text-green-600">
								Service ID: #{activeService._id.slice(-6)}
							</p>
						)}
					</div>
					{workStarted && (
						<Badge
							variant="success"
							className="px-3 py-1 bg-green-100 text-green-800 border border-green-200"
						>
							<Clock className="w-4 h-4 mr-1" />
							In Progress
						</Badge>
					)}
				</div>
			</CardHeader>

			{error ? (
				<CardContent className="pt-6 relative">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				</CardContent>
			) : activeService ? (
				<>
					<CardContent className="space-y-6 pt-6 relative">
						{/* Service Details */}
						<div className="rounded-lg bg-white/80 p-4 space-y-4 shadow-sm border border-green-100">
							<div className="flex items-center space-x-4">
								<MapPin className="w-6 h-6 text-green-600" />
								<div className="flex-1">
									<p className="font-medium">
										{activeService?.userLocation?.address ||
											"No address provided"}
									</p>
									<p className="text-sm text-green-600">
										Service:{" "}
										{activeService?.service?.name || "No service specified"}
									</p>
								</div>
								{activeService?.userLocation?.address && (
									<Button
										variant="outline"
										size="sm"
										className="border-green-200 hover:bg-green-50"
										onClick={() => {
											const address = encodeURIComponent(
												activeService.userLocation.address
											);
											window.open(
												`https://www.google.com/maps/search/?api=1&query=${address}`,
												"_blank"
											);
										}}
									>
										<Navigation className="w-4 h-4 mr-2 text-green-600" />
										Navigate
									</Button>
								)}
							</div>
							<div className="flex items-center space-x-4">
								<PackageOpen className="w-6 h-6 text-green-600" />
								<div>
									<p className="font-medium">Service Details</p>
									<p className="text-sm text-green-600">
										Status: {workStarted ? "In Progress" : "Not Started"}
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<IndianRupee className="w-6 h-6 text-green-600" />
								<span className="text-green-700">
									Price: {activeService?.price}
								</span>
							</div>
							<div className="flex items-center space-x-2">
								<NotepadText className="w-6 h-6 text-green-600" />
								<span className="text-green-700">
									Note: {activeService?.remarks}
								</span>
							</div>
						</div>

						{/* Extra Works Section */}
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<h3 className="text-lg font-semibold text-green-800">
									Extra Works
								</h3>
								<Dialog
									open={showExtraWorkDialog}
									onOpenChange={setShowExtraWorkDialog}
								>
									<DialogTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="border-green-200 hover:bg-green-50"
										>
											<Plus className="h-4 w-4 mr-2" />
											Add Extra Work
										</Button>
									</DialogTrigger>
									{/* Dialog content remains the same */}
								</Dialog>
							</div>

							<div className="space-y-3">
								{extraWorks.length === 0 ? (
									<div className="text-center py-8 text-green-600 bg-white/80 rounded-lg border border-green-100">
										No extra works requested yet
									</div>
								) : (
									extraWorks.map((work, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-4 bg-white/80 rounded-lg border border-green-100"
										>
											<div className="space-y-1">
												<p className="font-medium text-green-800">
													{work.description}
												</p>
												<p className="text-sm text-green-600">
													${work.price.toFixed(2)}
												</p>
											</div>
											<Badge
												variant={work.approved ? "success" : "secondary"}
												className={`px-3 py-1 ${
													work.approved
														? "bg-green-100 text-green-800 border-green-200"
														: "bg-gray-100 text-gray-800 border-gray-200"
												}`}
											>
												{work.approved ? "Approved" : "Pending"}
											</Badge>
										</div>
									))
								)}
							</div>
						</div>
					</CardContent>

					<CardFooter className="border-t border-green-100 bg-white/80 px-6 py-4 relative">
						<div className="flex justify-end w-full space-x-4">
							{!workStarted ? (
								<Button
									onClick={() =>
										activeService?._id && handleStartService(activeService._id)
									}
									disabled={loading}
									size="lg"
									className="bg-green-600 hover:bg-green-700 text-white"
								>
									{loading ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Starting...
										</>
									) : (
										"Start Work"
									)}
								</Button>
							) : (
								<Button
									onClick={handleCompleteWork}
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
							)}
						</div>
					</CardFooter>
				</>
			) : null}
		</Card>
	);
};

export default ActiveService;
