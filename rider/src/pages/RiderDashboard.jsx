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
import { Info, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import ProfileTab from "@/components/Profile";
import ServicesTab from "@/components/Services";
import OverviewTab from "@/components/Overview";
import HistoryTab from "@/components/History";

// Main Dashboard Layout
const RiderDashboard = () => {
	const [activeTab, setActiveTab] = useState("overview");
	const [isOnline, setIsOnline] = useState(true);

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Header */}
			<header className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Avatar className="h-10 w-10">
							<AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
							<AvatarFallback>RD</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<h2 className="text-lg font-semibold">Rider Dashboard</h2>
							<div className="flex items-center space-x-2">
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
					<Button variant="outline" onClick={() => setActiveTab("profile")}>
						<Settings className="w-4 h-4 mr-2" />
						Settings
					</Button>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 py-6">
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="mb-4">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="services">Services</TabsTrigger>
						<TabsTrigger value="history">History</TabsTrigger>
						<TabsTrigger value="profile">Profile</TabsTrigger>
					</TabsList>

					<TabsContent value="overview">
						<OverviewTab />
					</TabsContent>
					<TabsContent value="services">
						<ServicesTab />
					</TabsContent>
					<TabsContent value="history">
						<HistoryTab />
					</TabsContent>
					<TabsContent value="profile">
						<ProfileTab />
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
};

export default RiderDashboard;
