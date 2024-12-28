// src/components/ActiveService.jsx
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CardFooter } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { CheckCircle2, Loader2, Plus } from "lucide-react";
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
			console.log(service);
			setActiveService(service);
		});
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	console.log(activeService);

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
									Service: {activeService.service?.name}
								</p>
							</div>
						</div>
					</CardContent>
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
												onChange={(e) => setNewWorkDescription(e.target.value)}
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
											onClick={() => handleExtraWorkRequest(activeService._id)}
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
							<Button
								onClick={() => handleStartService(activeService._id)}
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
				</div>
			)}
		</Card>
	);
};

export default ActiveService;
