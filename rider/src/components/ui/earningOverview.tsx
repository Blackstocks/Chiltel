import React from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	TrendingUp,
	Wallet,
	CalendarDays,
	Clock,
	ArrowUpRight,
	ArrowDownRight,
} from "lucide-react";

const EarningsOverview = ({
	profile,
	currentMonthEarnings,
	percentageChange,
}) => {
	return (
		<Card className="border-none shadow-lg bg-gradient-to-br from-indigo-50 via-white to-blue-50">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl font-bold text-gray-800">
							Earnings Overview
						</CardTitle>
						<CardDescription className="mt-1 text-gray-600">
							Track your financial performance
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex gap-4 overflow-x-auto flex-nowrap sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
					{/* Total Earnings Card */}
					<div className="relative min-w-[240px] sm:min-w-0 p-6 overflow-hidden transition-all duration-200 bg-white border border-green-100 shadow-sm rounded-xl hover:shadow-md group">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-sm font-medium text-gray-500">
									Total Earnings
								</p>
								<div className="flex items-baseline space-x-2">
									<span className="text-2xl font-bold text-gray-800">
										₹
										{profile.earning.reduce(
											(total, e) => total + e.amount,
											0
										) || 0}
									</span>
								</div>
							</div>
							<div className="p-3 transition-colors duration-200 bg-green-100 rounded-full group-hover:bg-green-200">
								<Wallet className="w-5 h-5 text-green-600" />
							</div>
						</div>
						<div className="flex items-center gap-2 mt-4">
							<div className="flex items-center gap-1 text-green-600">
								<ArrowUpRight className="w-4 h-4" />
								<span className="text-sm font-medium">Lifetime earnings</span>
							</div>
						</div>
						<div className="absolute w-24 h-24 transition-opacity duration-200 rounded-full -right-6 -top-6 bg-green-50 opacity-20 group-hover:opacity-30"></div>
					</div>

					{/* Monthly Earnings Card */}
					<div className="relative min-w-[240px] sm:min-w-0 p-6 overflow-hidden transition-all duration-200 bg-white border border-blue-100 shadow-sm rounded-xl hover:shadow-md group">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-sm font-medium text-gray-500">
									Monthly Earnings
								</p>
								<div className="flex items-baseline space-x-2">
									<span className="text-2xl font-bold text-gray-800">
										₹{currentMonthEarnings}
									</span>
								</div>
							</div>
							<div className="p-3 transition-colors duration-200 bg-blue-100 rounded-full group-hover:bg-blue-200">
								<CalendarDays className="w-5 h-5 text-blue-600" />
							</div>
						</div>
						<div className="flex items-center gap-2 mt-4">
							<div
								className={`flex items-center gap-1 ${
									percentageChange >= 0 ? "text-green-600" : "text-red-600"
								}`}
							>
								{percentageChange >= 0 ? (
									<ArrowUpRight className="w-4 h-4" />
								) : (
									<ArrowDownRight className="w-4 h-4" />
								)}
								<span className="text-sm font-medium">
									{Math.abs(percentageChange).toFixed(1)}% vs last month
								</span>
							</div>
						</div>
						<div className="absolute w-24 h-24 transition-opacity duration-200 rounded-full -right-6 -top-6 bg-blue-50 opacity-20 group-hover:opacity-30"></div>
					</div>

					{/* Today's Earnings Card */}
					<div className="relative min-w-[240px] sm:min-w-0 p-6 overflow-hidden transition-all duration-200 bg-white border border-purple-100 shadow-sm rounded-xl hover:shadow-md group">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-sm font-medium text-gray-500">
									Today's Earnings
								</p>
								<div className="flex items-baseline space-x-2">
									<span className="text-2xl font-bold text-gray-800">
										₹
										{profile.earning
											.filter(
												(e) =>
													new Date(e.date).toDateString() ===
													new Date().toDateString()
											)
											.reduce((total, e) => total + e.amount, 0)}
									</span>
								</div>
							</div>
							<div className="p-3 transition-colors duration-200 bg-purple-100 rounded-full group-hover:bg-purple-200">
								<Clock className="w-5 h-5 text-purple-600" />
							</div>
						</div>
						<div className="flex items-center gap-2 mt-4">
							<div className="flex items-center gap-1 text-purple-600">
								<span className="text-sm font-medium">Updated live</span>
							</div>
						</div>
						<div className="absolute w-24 h-24 transition-opacity duration-200 rounded-full -right-6 -top-6 bg-purple-50 opacity-20 group-hover:opacity-30"></div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default EarningsOverview;
