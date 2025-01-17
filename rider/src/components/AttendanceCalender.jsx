import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle2, CalendarOff } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AttendanceCalendar = () => {
	const [selectedDate, setSelectedDate] = useState(new Date());

	// Example data - replace with your actual data
	const [attendance] = useState({
		"2024-01-15": { status: "present" },
		"2024-01-16": { status: "present" },
		"2024-01-17": { status: "present" },
	});

	const [leaveRequests, setLeaveRequests] = useState({
		"2024-01-20": { status: "leave" },
		"2024-01-21": { status: "leave" },
	});

	const handleLeaveRequest = () => {
		if (selectedDate > new Date()) {
			const dateKey = selectedDate.toISOString().split("T")[0];
			setLeaveRequests((prev) => ({
				...prev,
				[dateKey]: { status: "leave" },
			}));
		}
	};

	// Function to format date to match the key format
	const formatDateKey = (date) => {
		return date.toISOString().split("T")[0];
	};

	// Function to check date status
	const getDateStatus = (date) => {
		const dateKey = formatDateKey(date);
		if (attendance[dateKey]) return "present";
		if (leaveRequests[dateKey]) return "leave";
		return null;
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

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>Attendance & Leave</span>
					<div className="flex items-center gap-4 text-sm">
						<div className="flex items-center gap-1">
							<CheckCircle2 className="h-4 w-4 text-green-500" />
							<span>{Object.keys(attendance).length} Present</span>
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
					<div className="rounded-md border p-3">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={(date) => setSelectedDate(date || new Date())}
							components={{
								DayContent: ({ date, isSelected }) =>
									renderDay(date, isSelected),
							}}
						/>
					</div>

					{selectedDate > new Date() &&
						!leaveRequests[formatDateKey(selectedDate)] && (
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="outline">
										Request Leave for {selectedDate.toLocaleDateString()}
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Confirm Leave Request</DialogTitle>
									</DialogHeader>
									<div className="flex justify-end gap-2 pt-4">
										<DialogClose asChild>
											<Button variant="outline">Cancel</Button>
										</DialogClose>
										<DialogClose asChild>
											<Button onClick={handleLeaveRequest}>
												Confirm Leave
											</Button>
										</DialogClose>
									</div>
								</DialogContent>
							</Dialog>
						)}

					<div className="grid grid-cols-2 gap-4">
						<div className="rounded-lg border p-3">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 text-green-500" />
								<p className="text-sm">Present Days</p>
							</div>
							<p className="mt-1 text-2xl font-bold">
								{
									Object.keys(attendance).filter(
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
