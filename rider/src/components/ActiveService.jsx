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
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import CompleteBtn from "./CompleteBtn";
import { toast } from "react-toastify";

const faultTypes = [
	"Gas Refilling",
	"Installation",
	"Uninstallation",
	"General Service",
	"Repair",
	"Other",
];

const ActiveService = () => {
	const [activeService, setActiveService] = useState(null);
	const {
		getActiveService,
		loading,
		error,
		addFaults,
		addRepairDetails,
		addExtraWorks,
		updateServiceStatus,
	} = useServices();
	const [extraWorks, setExtraWorks] = useState([]);
	const [showExtraWorkDialog, setShowExtraWorkDialog] = useState(false);
	const [selectedWorks, setSelectedWorks] = useState([]);
	const [workStarted, setWorkStarted] = useState(false);
	const [openAccordions, setOpenAccordions] = useState([]);
	const [faultImages, setFaultImages] = useState([]);
	const [showFaultImageDialog, setShowFaultImageDialog] = useState(false);
	const [faultType, setFaultType] = useState("");
	const [faultNote, setFaultNote] = useState("");

	useEffect(() => {
		getActiveService().then((service) => {
			setActiveService(service);
			setExtraWorks(service?.addedWorks || []);
			setWorkStarted(service?.status === "IN_PROGRESS" || false);
		});
	}, []);

	const handleCheckboxChange = (category, item) => {
		const workKey = `${category}-${item.description}`;
		setSelectedWorks((prev) => {
			if (prev.find((work) => work.key === workKey)) {
				return prev.filter((work) => work.key !== workKey);
			}
			return [...prev, { key: workKey, category, ...item }];
		});
	};

	const handleAddExtraWorks = async () => {
		const newExtraWorks = selectedWorks.map((work) => ({
			description: work.description,
			price: parseFloat(work.service_charge.replace(/[₹,\s]/g, "")),
			approved: false,
		}));
		await addExtraWorks(activeService._id, newExtraWorks);
		setExtraWorks((prev) => [...prev, ...newExtraWorks]);
		setSelectedWorks([]);
		setShowExtraWorkDialog(false);
	};

	const handleStartService = async (serviceId) => {
		await updateServiceStatus(serviceId, "IN_PROGRESS");
		setWorkStarted(true);
	};

	const handleUploadFaultImages = (event) => {
		const files = Array.from(event.target.files);
		if (files.length >= 2) {
			setFaultImages(files);
			console.log("Selected fault images:", files);
		} else {
			alert("Please select at least two images.");
		}
	};

	const handleSubmitFaultImages = async () => {
		if (faultImages.length < 2) {
			toast.error("Please select at least two images.");
			return;
		}

		if (!workStarted && !faultType) {
			toast.error("Please select a fault type.");
			return;
		}

		if (!faultNote) {
			toast.error(
				`Please add a note about the ${workStarted ? "repair" : "fault"}.`
			);
			return;
		}

		// Handle the submission of fault images, fault type, and fault note
		console.log("Fault Type:", faultType);
		console.log("Fault Note:", faultNote);
		console.log("Fault Images:", faultImages);

		try {
			// Call the API to add the fault details
			if (workStarted) {
				await addRepairDetails(activeService._id, { faultImages, faultNote });
			} else {
				await addFaults(activeService._id, {
					faultImages,
					faultType,
					faultNote,
				});
			}
			toast.success(
				(workStarted ? "Repair" : "Fault") + " details added successfully"
			);
			setFaultImages([]);
			setFaultType("");
			setFaultNote("");
			setShowFaultImageDialog(false);
		} catch (error) {
			console.error("Error adding fault details:", error);
			toast.error(error.message);
		}
	};

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

	const RateChartContent = () => {
		if (!activeService?.service?.rateChart) {
			return (
				<div className="p-4 text-center text-gray-500">
					No rate chart available
				</div>
			);
		}

		return (
			<Accordion
				type="multiple"
				value={openAccordions}
				onValueChange={setOpenAccordions}
				className="w-full"
			>
				{Object.entries(activeService.service.rateChart).map(
					([category, items]) => (
						<AccordionItem key={category} value={category}>
							<AccordionTrigger className="text-lg font-semibold capitalize">
								{category.replace(/_/g, " ")}
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4">
									{items.map((item, index) => (
										<div
											key={index}
											className="flex items-center space-x-4 py-2 hover:bg-gray-50 rounded-lg px-2"
										>
											<div
												onClick={(e) => {
													e.stopPropagation();
													if (!openAccordions.includes(category)) {
														setOpenAccordions((prev) => [...prev, category]);
													}
												}}
											>
												<Checkbox
													id={`${category}-${index}`}
													checked={selectedWorks.some(
														(work) =>
															work.key === `${category}-${item.description}`
													)}
													onCheckedChange={() =>
														handleCheckboxChange(category, item)
													}
												/>
											</div>
											<Label
												htmlFor={`${category}-${index}`}
												className="flex-1 cursor-pointer"
												onClick={(e) => {
													e.stopPropagation();
													if (!openAccordions.includes(category)) {
														setOpenAccordions((prev) => [...prev, category]);
													}
												}}
											>
												{item.description}
											</Label>
											<span className="text-green-600 font-medium min-w-[100px] text-right">
												{item.service_charge}
											</span>
										</div>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>
					)
				)}
			</Accordion>
		);
	};

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
											handleNavigate(activeService);
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
									<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
										<DialogHeader>
											<DialogTitle>Select Extra Works</DialogTitle>
										</DialogHeader>

										<RateChartContent />

										<DialogFooter className="mt-6">
											<div className="flex justify-between items-center w-full">
												<div className="text-sm text-gray-600">
													{selectedWorks.length} items selected
												</div>
												<Button
													onClick={handleAddExtraWorks}
													disabled={selectedWorks.length === 0}
													className="bg-green-600 hover:bg-green-700 text-white"
												>
													Add Selected Works
												</Button>
											</div>
										</DialogFooter>
									</DialogContent>
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
													₹{work.price.toFixed(2)}
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
							<Dialog
								open={showFaultImageDialog}
								onOpenChange={setShowFaultImageDialog}
							>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										size="lg"
										className="border-green-200 hover:bg-green-50"
									>
										{workStarted ? "Add Work Details" : "Add Fault Details"}
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-md">
									<DialogHeader>
										<DialogTitle>
											Upload {workStarted ? "Repaired" : "Fault"} Images
										</DialogTitle>
									</DialogHeader>
									<Input
										type="file"
										accept="image/*"
										multiple
										onChange={handleUploadFaultImages}
									/>
									{faultImages.length > 0 && (
										<div className="mt-4 space-y-2 flex flex-wrap">
											{faultImages.map((image, index) => (
												<img
													key={index}
													src={URL.createObjectURL(image)}
													alt={`Fault ${index + 1}`}
													className="w-[30%] h-auto rounded-lg object-contain"
												/>
											))}
										</div>
									)}
									{!workStarted && (
										<Select
											value={faultType}
											onValueChange={setFaultType} // Changed from onChange
										>
											<SelectTrigger className="mt-4">
												<SelectValue placeholder="Select Fault Type" />
											</SelectTrigger>
											<SelectContent>
												{faultTypes.map((type) => (
													<SelectItem key={type} value={type}>
														{type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
									<Input
										type="text"
										placeholder={`Add a note about the ${
											workStarted ? "repair" : "fault"
										}`}
										value={faultNote}
										onChange={(e) => setFaultNote(e.target.value)}
										className="mt-4"
									/>
									<DialogFooter>
										<Button
											onClick={handleSubmitFaultImages}
											className="bg-green-600 hover:bg-green-700 text-white"
										>
											Submit
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
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
								<CompleteBtn serviceId={activeService._id} loading={loading} />
							)}
						</div>
					</CardFooter>
				</>
			) : null}
		</Card>
	);
};

export default ActiveService;
