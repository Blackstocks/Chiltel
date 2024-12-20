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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

// Overview Tab Component
const OverviewTab = () => {
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
					<CardTitle className="text-sm font-medium">
						Completed Services
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">8</div>
					<p className="text-xs text-gray-500">Today's completion</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-sm font-medium">Rating</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">4.8</div>
					<p className="text-xs text-gray-500">Based on 150 reviews</p>
				</CardContent>
			</Card>

			{/* Active Service Card */}
			<Card className="md:col-span-2 lg:col-span-3">
				<CardHeader>
					<CardTitle>Current Service</CardTitle>
					<CardDescription>Active service details</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center space-x-4">
						<MapPin className="w-6 h-6 text-blue-500" />
						<div>
							<p className="font-medium">123 Main St, City</p>
							<p className="text-sm text-gray-500">Service: Home Cleaning</p>
						</div>
					</div>
				</CardContent>
				<CardFooter className="justify-between">
					<Button variant="outline">Navigate</Button>
					<Button>Complete Service</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

// Services Tab Component
const ServicesTab = () => {
	return (
		<ScrollArea className="h-[600px] rounded-md border p-4">
			{/* Pending Services */}
			{[1, 2, 3].map((service) => (
				<Card key={service} className="mb-4">
					<CardHeader>
						<div className="flex justify-between items-center">
							<CardTitle>Service Request #{service}</CardTitle>
							<Badge>New Request</Badge>
						</div>
						<CardDescription>Posted 2 minutes ago</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<MapPin className="w-4 h-4" />
								<span>456 Oak Street, Downtown</span>
							</div>
							<div className="flex items-center space-x-2">
								<Clock className="w-4 h-4" />
								<span>Estimated time: 2 hours</span>
							</div>
							<div className="flex items-center space-x-2">
								<Package className="w-4 h-4" />
								<span>Service: Deep Cleaning</span>
							</div>
						</div>
					</CardContent>
					<CardFooter className="justify-end space-x-2">
						<Button variant="outline">Decline</Button>
						<Button>Accept Service</Button>
					</CardFooter>
				</Card>
			))}
		</ScrollArea>
	);
};

// History Tab Component
const HistoryTab = () => {
	return (
		<ScrollArea className="h-[600px] rounded-md border p-4">
			{[1, 2, 3, 4, 5].map((service) => (
				<Card key={service} className="mb-4">
					<CardHeader>
						<div className="flex justify-between items-center">
							<CardTitle>Service #{service}</CardTitle>
							<Badge variant="outline" className="bg-green-50">
								Completed
							</Badge>
						</div>
						<CardDescription>Completed on Dec 19, 2024</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<User className="w-4 h-4" />
								<span>John Doe</span>
							</div>
							<div className="flex items-center space-x-2">
								<MapPin className="w-4 h-4" />
								<span>789 Pine Road, Suburb</span>
							</div>
							<div className="flex items-center space-x-2">
								<Package className="w-4 h-4" />
								<span>Service: Window Cleaning</span>
							</div>
							<div className="flex items-center space-x-2">
								<CheckCircle2 className="w-4 h-4 text-green-500" />
								<span>Rating: 5.0</span>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</ScrollArea>
	);
};

// Profile Tab Component
const ProfileTab = () => {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Personal Information</CardTitle>
					<CardDescription>Update your personal details</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input id="name" defaultValue="John Doe" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" defaultValue="john@example.com" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone">Phone</Label>
						<Input id="phone" defaultValue="+1 234 567 890" />
					</div>
				</CardContent>
				<CardFooter>
					<Button>Save Changes</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Account Settings</CardTitle>
					<CardDescription>Manage your account preferences</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h4 className="font-medium">Push Notifications</h4>
							<p className="text-sm text-gray-500">
								Receive notifications for new services
							</p>
						</div>
						<Button variant="outline">Configure</Button>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<h4 className="font-medium">Location Services</h4>
							<p className="text-sm text-gray-500">
								Allow location tracking while on duty
							</p>
						</div>
						<Button variant="outline">Configure</Button>
					</div>
				</CardContent>
			</Card>

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="destructive" className="w-full">
						Deactivate Account
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently deactivate
							your account and remove your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction className="bg-red-500">
							Deactivate
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default RiderDashboard;
