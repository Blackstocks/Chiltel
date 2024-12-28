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
import { CheckCircle2, Clock, Navigation, Phone, Plus } from "lucide-react";
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
					<div className="text-2xl font-bold">$124.50</div>
					<p className="text-xs text-gray-500">+12% from yesterday</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-sm font-medium">Total Services</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{profile.assignedServices.length}
					</div>
					{/* <p className="text-xs text-gray-500">Today's completion</p> */}
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
	const { getAcceptedServices, loading, error } = useServices();
	const [currServices, setCurrServices] = useState(null);
	const [extraWorks, setExtraWorks] = useState([]);
	const [showExtraWorkDialog, setShowExtraWorkDialog] = useState(false);
	const [newWorkDescription, setNewWorkDescription] = useState("");
	const [newWorkPrice, setNewWorkPrice] = useState("");
	const [workStarted, setWorkStarted] = useState(false);

	useEffect(() => {
		getAcceptedServices().then((service) => {
			setCurrServices(service);
		});
	}, []);

	console.log(currServices);
	if (loading) {
		return (
			<div className="text-center text-gray-500 mt-4">Loading services...</div>
		);
	}

	// Function to open navigation
	const handleNavigate = (currService) => {
		console.log(currService);
		if (currService?.userLocation?.coordinates) {
			window.open(
				`https://www.google.com/maps/dir/?api=1&destination=${currService.userLocation.coordinates[0]},${currService.userLocation.coordinates[0]}`,
				"_blank"
			);
		}
	};

	// Function to request extra work
	const handleExtraWorkRequest = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch("/api/service/extra-work", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					serviceId: service.id,
					description: newWorkDescription,
					price: parseFloat(newWorkPrice),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to request extra work");
			}

			const data = await response.json();
			setExtraWorks([...extraWorks, data]);
			setShowExtraWorkDialog(false);
			setNewWorkDescription("");
			setNewWorkPrice("");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	// Function to start work
	const handleStartWork = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`/api/service/${service.id}/start`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to start work");
			}

			setWorkStarted(true);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	// Function to complete work
	const handleCompleteWork = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`/api/service/${service.id}/complete`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to complete work");
			}

			// Handle successful completion (e.g., redirect or update UI)
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{<ActiveService />}
			<Card className="md:col-span-2 lg:col-span-3">
				<CardHeader>
					<CardTitle>Accepted Services</CardTitle>
					<CardDescription>Active service details</CardDescription>
				</CardHeader>
				{!currServices && error ? (
					<CardDescription className="text-center m-2">{error}</CardDescription>
				) : (
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

								<div className="flex items-center space-x-2">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span>{currService?.user?.phone}</span>
								</div>

								<div className="flex items-center space-x-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span>
										Estimated Duration: {currService?.service.estimatedDuration}{" "}
										minutes
									</span>
								</div>
							</div>

							{/* Extra Works Section */}
							<div>
								<div className="flex justify-between items-center mb-4">
									<h3 className="font-semibold">Extra Works</h3>
									<Dialog
										open={showExtraWorkDialog}
										onOpenChange={setShowExtraWorkDialog}
									>
										<DialogTrigger asChild>
											<Button variant="outline" size="sm">
												<Plus className="h-4 w-4 mr-2" />
												Add Extra Work
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Request Extra Work</DialogTitle>
												<DialogDescription>
													Describe the additional work required and set a price.
												</DialogDescription>
											</DialogHeader>
											<div className="space-y-4">
												<div>
													<Label htmlFor="description">Description</Label>
													<Input
														id="description"
														value={newWorkDescription}
														onChange={(e) =>
															setNewWorkDescription(e.target.value)
														}
														placeholder="Describe the extra work"
													/>
												</div>
												<div>
													<Label htmlFor="price">Price</Label>
													<Input
														id="price"
														type="number"
														value={newWorkPrice}
														onChange={(e) => setNewWorkPrice(e.target.value)}
														placeholder="Enter price"
													/>
												</div>
											</div>
											<DialogFooter>
												<Button
													type="submit"
													onClick={handleExtraWorkRequest}
													disabled={loading}
												>
													{loading ? (
														<>
															<Loader2 className="h-4 w-4 mr-2 animate-spin" />
															Requesting...
														</>
													) : (
														"Request Approval"
													)}
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>

								{/* Extra Works List */}
								<div className="space-y-2">
									{extraWorks.map((work, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
										>
											<div>
												<p className="font-medium">{work.description}</p>
												<p className="text-sm text-muted-foreground">
													${work.price}
												</p>
											</div>
											<Badge variant={work.approved ? "success" : "pending"}>
												{work.approved ? "Approved" : "Pending"}
											</Badge>
										</div>
									))}
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex justify-end space-x-4">
								{!workStarted ? (
									<Button onClick={handleStartWork} disabled={loading}>
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
										className="bg-green-600 hover:bg-green-700"
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
						</CardContent>
					))
				)}
			</Card>
		</>
	);
};

export default OverviewTab;
