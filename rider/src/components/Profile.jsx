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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthActions } from "../hooks/useAuthActions";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { useState } from "react";
import { useEffect } from "react";
import { apiService } from "../services/api.service";

const ProfileTab = () => {
	const { logout } = useAuthActions();
	const [profile, setProfile] = useState({
		firstName: "Loading...",
		lastName: "Loading...",
		email: "Loading...",
		phoneNumber: "Loading...",
	});

	useEffect(() => {
		const fetchProfile = async () => {
			const response = await apiService.getProfile(
				localStorage.getItem("riderToken")
			);
			console.log("response", response);
			setProfile(response);
		};
		fetchProfile();
	}, []);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Personal Information</CardTitle>
					<CardDescription>Update your personal details</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">First Name</Label>
						<Input id="firstName" defaultValue={profile.firstName} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="name">Last Name</Label>
						<Input id="lastName" defaultValue={profile.lastName} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" defaultValue={profile.email} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone">Phone</Label>
						<Input id="phoneNumber" defaultValue={profile.phoneNumber} />
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
				<Button variant="destructive" className="m-2" onClick={logout}>
					Log Out
				</Button>
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

export default ProfileTab;
