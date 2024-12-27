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
import {
	AlertCircle,
	CheckCircle2,
	MapPin,
	Package,
	User,
	Clock,
	Settings,
} from "lucide-react";

import ProfileTab from "@/components/Profile";
import ServicesTab from "@/components/Services";
import OverviewTab from "@/components/Overview";
import HistoryTab from "@/components/History";

// Main Dashboard Layout
const RiderDashboard = () => {
	const [activeTab, setActiveTab] = useState("overview");

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Header */}
			<header className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Avatar className="h-10 w-10">
							<AvatarImage src="/placeholder-avatar.jpg" />
							<AvatarFallback>RD</AvatarFallback>
						</Avatar>
						<div>
							<h2 className="text-lg font-semibold">Rider Dashboard</h2>
							<Badge variant="outline" className="bg-green-50">
								Online
							</Badge>
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
