import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle2, CalendarOff, Clock } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useServices } from "@/hooks/useServices";

const AttendanceCalendar = () => {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [leaveReason, setLeaveReason] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [workingHours, setWorkingHours] = useState({
		"2024-01-15": { hours: 8, durations: [{ start: "09:00", end: "17:00" }] },
		"2024-01-16": { hours: 7.5, durations: [{ start: "09:30", end: "17:00" }] },
	});

	const [present, setPresent] = useState({
		"2024-01-15": { status: "present" },
		"2024-01-16": { status: "present" },
		"2024-01-17": { status: "present" },
	});

	const [leaveRequests, setLeaveRequests] = useState({
		"2024-01-20": { status: "leave", reason: "Personal" },
		"2024-01-21": { status: "leave", reason: "Sick" },
	});

	const { markAttendance, getAttendance } = useServices();

	useEffect(() => {
		const fetchAttendance = async () => {
			const attendances = await getAttendance();
			const newPresent = {};
			attendances.present.forEach((date) => {
				newPresent[date.split("T")[0]] = { status: "present" };
			});
			setPresent(newPresent);

			const newLeaveRequests = {};
			attendances.leaves.forEach((leave) => {
				newLeaveRequests[leave.date.split("T")[0]] = {
					status: "leave",
					reason: leave.reason,
				};
			});
			setLeaveRequests(newLeaveRequests);

			// Set working hours
			const newWorkingHours = {};
			attendances.workingHours.forEach((workDay) => {
				newWorkingHours[workDay.date] = {
					hours: workDay.hours,
					durations: workDay.durations.map((duration) => ({
						start: new Date(duration.start).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						}),
						end: new Date(duration.end).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						}),
					})),
				};
			});
			setWorkingHours(newWorkingHours);
		};
		fetchAttendance();
	}, []);

	const handleLeaveRequest = async () => {
		if (!leaveReason) {
			toast.error("Please enter a reason for leave");
			return;
		}
		if (selectedDate > new Date()) {
			setIsLoading(true);
			const dateKey = selectedDate.toISOString().split("T")[0];
			try {
				await markAttendance({
					date: selectedDate,
					type: "leave",
					reason: leaveReason,
				});
			} catch (error) {
				toast.error("Failed to mark leave request");
				setIsLoading(false);
				return;
			}
			setLeaveRequests((prev) => ({
				...prev,
				[dateKey]: { status: "leave", reason: leaveReason },
			}));
			setLeaveReason("");
			setIsLoading(false);
			setIsDialogOpen(false);
		}
	};

	const formatDateKey = (date) => {
		return date.toISOString().split("T")[0];
	};

	const getDateStatus = (date) => {
		const dateKey = formatDateKey(date);
		if (present[dateKey]) return "present";
		if (leaveRequests[dateKey]) return "leave";
		return null;
	};

	const getWorkingHours = (date) => {
		const dateKey = formatDateKey(date);
		return workingHours[dateKey];
	};

	const renderDay = (date, selected) => {
		const status = getDateStatus(date);

		return (
			<div className="relative flex h-8 w-8 items-center justify-center p-0">
				<span className={selected ? "text-white" : ""}>{date.getDate()}</span>
				{status === "present" && (
					<div className="absolute -bottom-1">
						<CheckCircle2 className="h-3 w-3 text-green-500" />
					</div>
				)}
				{status === "leave" && (
					<div className="absolute -bottom-1">
						<CalendarOff className="h-3 w-3 text-orange-500" />
					</div>
				)}
			</div>
		);
	};

	const renderWorkingHours = () => {
		const workHours = getWorkingHours(selectedDate);
		const status = getDateStatus(selectedDate);

		// if (status !== "present" || !workHours) {
		// 	return null;
		// }

		return (
			<div className="mt-4 rounded-lg border p-4">
				<div className="flex items-center gap-2 mb-3">
					<Clock className="h-5 w-5 text-blue-500" />
					<h3 className="font-medium">
						Working Hours - {selectedDate.toLocaleDateString()}
					</h3>
				</div>

				{workHours ? (
					<>
						<div className="flex items-center justify-between mb-4 px-2">
							<span className="text-sm text-gray-600">Total Hours:</span>
							<span className="text-lg font-semibold">{workHours.hours}</span>
						</div>

						<div className="space-y-2">
							{workHours.durations.map((duration, index) => (
								<div
									key={index}
									className="flex items-center justify-between bg-gray-50 p-2 rounded"
								>
									<span className="text-sm text-gray-600">
										Duration {index + 1}
									</span>
									<span className="font-medium">
										{duration.start} - {duration.end}
									</span>
								</div>
							))}
						</div>
					</>
				) : (
					<p className="text-sm text-gray-500">No working hours recorded</p>
				)}
			</div>
		);
	};

	return (
		<Card className="w-full max-w-4xl mx-auto">
			<CardHeader>
				<CardTitle className="flex flex-col sm:flex-row items-center justify-between">
					<span>Present & Leave</span>
					<div className="flex items-center gap-4 text-sm mt-2 sm:mt-0">
						<div className="flex items-center gap-1">
							<CheckCircle2 className="h-4 w-4 text-green-500" />
							<span>{Object.keys(present).length} Present</span>
						</div>
						<div className="flex items-center gap-1">
							<CalendarOff className="h-4 w-4 text-orange-500" />
							<span>{Object.keys(leaveRequests).length} Leave</span>
						</div>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-4">
					<div className="rounded-md border p-3 overflow-x-auto">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={(date) => setSelectedDate(date || new Date())}
							components={{
								DayContent: ({ date, isSelected }) =>
									renderDay(date, isSelected),
							}}
							className="flex justify-center"
						/>
					</div>

					{/* Working Hours Information */}
					{renderWorkingHours()}

					{/* Leave Request Dialog */}
					{selectedDate > new Date() &&
						!leaveRequests[formatDateKey(selectedDate)] && (
							<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										onClick={() => setIsDialogOpen(true)}
									>
										Request Leave for {selectedDate.toLocaleDateString()}
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Confirm Leave Request</DialogTitle>
									</DialogHeader>
									<Input
										placeholder="Enter reason for leave"
										value={leaveReason}
										onChange={(e) => setLeaveReason(e.target.value)}
										className="mt-2"
										required
									/>
									<div className="flex justify-end gap-2 pt-4">
										<DialogClose asChild>
											<Button variant="outline" disabled={isLoading}>
												Cancel
											</Button>
										</DialogClose>
										<Button onClick={handleLeaveRequest} disabled={isLoading}>
											{isLoading ? "Processing..." : "Confirm Leave"}
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						)}

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="rounded-lg border p-3">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 text-green-500" />
								<p className="text-sm">Present Days</p>
							</div>
							<p className="mt-1 text-2xl font-bold">
								{
									Object.keys(present).filter(
										(date) =>
											new Date(date).getMonth() === new Date().getMonth()
									).length
								}
							</p>
							<p className="text-xs text-gray-500">This Month</p>
						</div>
						<div className="rounded-lg border p-3">
							<div className="flex items-center gap-2">
								<CalendarOff className="h-4 w-4 text-orange-500" />
								<p className="text-sm">Leave Days</p>
							</div>
							<p className="mt-1 text-2xl font-bold">
								{
									Object.keys(leaveRequests).filter(
										(date) =>
											new Date(date).getMonth() === new Date().getMonth()
									).length
								}
							</p>
							<p className="text-xs text-gray-500">This Month</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default AttendanceCalendar;
