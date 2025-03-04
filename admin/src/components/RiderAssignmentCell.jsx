import { useState, useCallback } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const RiderAssignmentCell = ({
	service,
	riders,
	handleMultipleRiderAssignment,
}) => {
	const [selectedRiders, setSelectedRiders] = useState([]);
	const [isOpen, setIsOpen] = useState(false);

	const eligibleRiders = riders.filter(
		(rider) =>
			service.services &&
			service.services.some((s) =>
				rider.specializations.includes(s.serviceId.product)
			)
			&& ((rider.securityDeposit.isPaid) && ((rider.balance>0 && rider.mode == "COMMISION") || rider.mode=="NORMAL"))
	);

	const handleSelect = useCallback((riderId) => {
		setSelectedRiders((prev) => {
			const isSelected = prev.includes(riderId);
			const newSelection = isSelected
				? prev.filter((id) => id !== riderId)
				: [...prev, riderId];

			console.log("Updated selection:", newSelection);
			return newSelection;
		});
	}, []);

	const handleSelectAll = useCallback(() => {
		setSelectedRiders((prev) => {
			const allRiderIds = eligibleRiders.map((rider) => rider._id);
			const newSelection =
				prev.length === eligibleRiders.length ? [] : allRiderIds;

			console.log("Updated all selection:", newSelection);
			return newSelection;
		});
	}, [eligibleRiders]);

	const handleAssignSelected = async () => {
		if (selectedRiders.length === 0) return;

		try {
			await handleMultipleRiderAssignment(service._id, selectedRiders);
			setIsOpen(false);
			setSelectedRiders([]);
		} catch (error) {
			console.error("Error assigning riders:", error);
			// Error is already handled by the handler function
		}
	};

	const resetSelections = useCallback(() => {
		setSelectedRiders([]);
		setIsOpen(false);
	}, []);

	return (
		<div className="space-y-2">
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setSelectedRiders([])} // Reset selections when opening
					>
						{service.assignedRider ? "Reassign Riders" : "Assign Riders"}
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							{service.assignedRider ? "Reassign Riders" : "Assign Riders"}
						</DialogTitle>
					</DialogHeader>

					{eligibleRiders.length > 0 && (
						<div className="flex items-center justify-between mb-4">
							<Button
								variant="outline"
								size="sm"
								onClick={handleSelectAll}
								className="flex items-center gap-2"
							>
								<Checkbox
									checked={selectedRiders.length === eligibleRiders.length}
									className="h-4 w-4"
								/>
								{selectedRiders.length === eligibleRiders.length
									? "Deselect All"
									: "Select All"}
							</Button>
							<span className="text-sm text-muted-foreground">
								{selectedRiders.length} selected
							</span>
						</div>
					)}

					<ScrollArea className="max-h-[400px] pr-4">
						<div className="space-y-2">
							{eligibleRiders.length > 0 ? (
								eligibleRiders.map((rider) => (
									<Card
										key={rider._id}
										className={`cursor-pointer hover:bg-accent transition-colors ${
											selectedRiders.includes(rider._id) ? "border-primary" : ""
										}`}
									>
										<CardContent
											className="p-4"
											onClick={(e) => {
												// Prevent handling card click if checkbox was clicked
												if (e.target.closest('[role="checkbox"]')) return;
												handleSelect(rider._id);
											}}
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<Checkbox
														checked={selectedRiders.includes(rider._id)}
														className="h-4 w-4"
														onCheckedChange={() => handleSelect(rider._id)}
													/>
													<div>
														<p className="font-medium">
															{`${rider.firstName} ${rider.lastName}`}
														</p>
														<div className="flex flex-wrap gap-1 mt-1">
															{rider.specializations.map((spec, index) => (
																<span
																	key={index}
																	className={`text-xs px-2 py-0.5 rounded-full ${
																		service.services.some(
																			(s) => s.serviceId.product === spec
																		)
																			? "bg-primary/10 text-primary"
																			: "bg-secondary/50 text-secondary-foreground"
																	}`}
																>
																	{spec}
																</span>
															))}
														</div>
													</div>
												</div>
												<div className="text-sm">
													{rider?.rating?.average?.toFixed(1) || "0.0"}★
												</div>
											</div>
										</CardContent>
									</Card>
								))
							) : (
								<p>No riders with the required specialization found</p>
							)}
						</div>
					</ScrollArea>

					<DialogFooter className="mt-4">
						<Button variant="outline" onClick={resetSelections}>
							Cancel
						</Button>
						<Button
							onClick={handleAssignSelected}
							disabled={selectedRiders.length === 0}
						>
							Assign Selected ({selectedRiders.length})
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{service.assignedRider && (
				<div className="flex flex-wrap gap-1">
					{riders
						.filter((r) => r._id === service.assignedRider)
						.map((rider) => (
							<Badge key={rider._id} variant="outline">
								Currently Assigned: {`${rider.firstName} ${rider.lastName}`}
							</Badge>
						))}
				</div>
			)}
		</div>
	);
};

export default RiderAssignmentCell;
