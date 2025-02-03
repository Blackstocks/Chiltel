import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Settings, Menu } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import ProfileTab from "@/components/Profile";
import ServicesTab from "@/components/Services";
import OverviewTab from "@/components/Overview";
import HistoryTab from "@/components/History";
import { useAuthActions } from "@/hooks/useAuthActions";
import AttendanceCalendar from "../components/AttendanceCalender";

const RiderDashboard = () => {
	const { logout } = useAuthActions();
	const [activeTab, setActiveTab] = useState("overview");
	const [isOnline, setIsOnline] = useState(true);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							<Menu className="h-6 w-6" />
						</Button>

						<div className="flex items-center space-x-4">
							<Avatar className="h-8 w-8 md:h-10 md:w-10">
								<AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
								<AvatarFallback>RD</AvatarFallback>
							</Avatar>
							<div className="space-y-1">
								<h2 className="text-base md:text-lg font-semibold">
									Rider Dashboard
								</h2>
								<div className="flex flex-wrap items-center gap-2">
									<Badge
										variant="outline"
										className={isOnline ? "bg-green-50" : "bg-red-50"}
									>
										{isOnline ? "Online" : "Busy"}
									</Badge>
									<Switch
										checked={isOnline}
										onCheckedChange={setIsOnline}
										className="data-[state=checked]:bg-green-500"
										aria-label="Online status toggle"
									/>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
												>
													<Info className="h-4 w-4 text-gray-500" />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>If you want to go offline, you have to log out</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							</div>
						</div>
						<div className="flex items-center">
							<Button
								variant="destructive"
								className="hidden md:block"
								onClick={logout}
							>
								Log Out
							</Button>
							<Button
								variant="destructive"
								size="sm"
								className="md:hidden"
								onClick={logout}
							>
								Exit
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-6 overflow-hidden">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<div className="overflow-x-auto -mx-2 px-2">
						<TabsList className="mb-4 w-full flex-nowrap min-w-full">
							<TabsTrigger
								value="overview"
								className="flex-1 whitespace-nowrap text-sm ml-24"
							>
								Overview
							</TabsTrigger>
							<TabsTrigger
								value="services"
								className="flex-1 whitespace-nowrap text-sm"
							>
								Services
							</TabsTrigger>
							<TabsTrigger
								value="history"
								className="flex-1 whitespace-nowrap text-sm"
							>
								History
							</TabsTrigger>
							<TabsTrigger
								value="attendance"
								className="flex-1 whitespace-nowrap text-sm"
							>
								Attendance
							</TabsTrigger>
							<TabsTrigger
								value="profile"
								className="flex-1 whitespace-nowrap text-sm"
							>
								Profile
							</TabsTrigger>
						</TabsList>
					</div>

					<div className="space-y-4 w-full max-w-full overflow-x-hidden">
						<TabsContent value="overview" className="mt-0">
							<Card className="p-2 md:p-4 overflow-x-auto">
								<div className="min-w-[300px]">
									<OverviewTab />
								</div>
							</Card>
						</TabsContent>
						<TabsContent value="services" className="mt-0">
							<Card className="p-2 md:p-4 overflow-x-auto">
								<div className="min-w-[300px]">
									<ServicesTab />
								</div>
							</Card>
						</TabsContent>
						<TabsContent value="history" className="mt-0">
							<Card className="p-2 md:p-4 overflow-x-auto">
								<div className="min-w-[300px]">
									<HistoryTab />
								</div>
							</Card>
						</TabsContent>
						<TabsContent value="attendance" className="mt-0">
							<Card className="p-2 md:p-4 overflow-x-auto">
								<div className="min-w-[300px]">
									<AttendanceCalendar />
								</div>
							</Card>
						</TabsContent>
						<TabsContent value="profile" className="mt-0">
							<Card className="p-2 md:p-4 overflow-x-auto">
								<div className="min-w-[300px]">
									<ProfileTab />
								</div>
							</Card>
						</TabsContent>
					</div>
				</Tabs>
			</main>
		</div>
	);
};

export default RiderDashboard;
