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
import { useProfile } from "../hooks/useProfile";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";

const ProfileTab = () => {
	const { logout } = useAuthActions();
	const [profileData, setProfileData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		fatherName: "",
		dateOfBirth: "",
		imageUrl: "",
		address: "",
		specializations: [],
	});

	const specializations = [
		{ value: "Air Conditioner", label: "Air Conditioner Service & Repair" },
		{ value: "Water Heater", label: "Water Heater Service & Repair" },
		{ value: "Microwave", label: "Microwave Service & Repair" },
		{ value: "Geyser", label: "Geyser Service & Repair" },
		{ value: "Refrigerator", label: "Refrigerator Service & Repair" },
		{ value: "Washing Machine", label: "Washing Machine Service & Repair" },
		{ value: "Air Cooler", label: "Air Cooler Service & Repair" },
		{ value: "Air Purifier", label: "Air Purifier Service & Repair" },
		{ value: "Water Purifier", label: "Water Purifier Service & Repair" },
		{ value: "Deep Freezer", label: "Deep Freezer Service & Repair" },
		{ value: "Visi Cooler", label: "Visi Cooler Service & Repair" },
		{ value: "Cassette AC", label: "Cassette AC Service & Repair" },
		{
			value: "Water Cooler cum Purifier",
			label: "Water Cooler cum Purifier Service & Repair",
		},
		{ value: "Water Dispenser", label: "Water Dispenser Service & Repair" },
		{ value: "Display Counter", label: "Display Counter Service & Repair" },
	];

	const { profile, loading, error, updateProfile } = useProfile();

	useEffect(() => {
		if (profile) {
			setProfileData({
				firstName: profile.firstName,
				lastName: profile.lastName,
				email: profile.email,
				phoneNumber: profile.phoneNumber,
				fatherName: profile.fatherName,
				dateOfBirth: profile.dateOfBirth,
				address: profile.address,

				specializations: profile.specializations || [],
			});
		}
	}, [profile]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error loading profile</div>;
	}

	const handleChange = (e) => {
		const { id, value } = e.target;
		if (id.startsWith("bankDetails.")) {
			const key = id.split(".")[1];
			setProfileData((prev) => ({
				...prev,
				bankDetails: {
					...prev.bankDetails,
					[key]: value,
				},
			}));
		} else {
			setProfileData((prev) => ({
				...prev,
				[id]: value,
			}));
		}
	};

	const handleSpecializationToggle = (value) => {
		setProfileData((prev) => {
			const specializations = prev.specializations.includes(value)
				? prev.specializations.filter((spec) => spec !== value)
				: [...prev.specializations, value];
			return { ...prev, specializations };
		});
	};

	const handleSaveChanges = async () => {
		if (
			!profileData.firstName ||
			!profileData.lastName ||
			!profileData.email ||
			!profileData.phoneNumber ||
			!profileData.fatherName ||
			!profileData.dateOfBirth ||
			!profileData.address ||
			profileData.specializations.length === 0
		) {
			toast.error("All fields are required");
			return;
		}
		try {
			await updateProfile(profileData);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Personal Information</CardTitle>
					<CardDescription>Update your personal details</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="firstName">First Name</Label>
						<Input
							id="firstName"
							defaultValue={profile.firstName}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="lastName">Last Name</Label>
						<Input
							id="lastName"
							defaultValue={profile.lastName}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							defaultValue={profile.email}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phoneNumber">Phone</Label>
						<Input
							id="phoneNumber"
							defaultValue={profile.phoneNumber}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="fatherName">Father's Name</Label>
						<Input
							id="fatherName"
							defaultValue={profile.fatherName}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="dateOfBirth">Date of Birth</Label>
						<Input
							id="dateOfBirth"
							type="date"
							defaultValue={new Date(profile.dateOfBirth)}
							onChange={handleChange}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="address">Address</Label>
						<Input
							id="address"
							defaultValue={profile.address}
							onChange={handleChange}
						/>
					</div>
				</CardContent>

				<Card className="mb-4">
					<CardHeader>
						<CardTitle>Professional Details</CardTitle>
						<CardDescription>Update your professional details</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label>Specializations</Label>
							<div className="grid grid-cols-2 gap-4">
								{specializations.map((spec) => (
									<div key={spec.value} className="flex items-center space-x-2">
										<Checkbox
											id={spec.value}
											checked={profileData.specializations.includes(spec.value)}
											onCheckedChange={() =>
												handleSpecializationToggle(spec.value)
											}
										/>
										<Label htmlFor={spec.value}>{spec.label}</Label>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
				<CardFooter>
					<Button onClick={handleSaveChanges}>Save Changes</Button>
				</CardFooter>
			</Card>

			<Button variant="destructive" className="m-2" onClick={logout}>
				Log Out
			</Button>
		</div>
	);
};

export default ProfileTab;
