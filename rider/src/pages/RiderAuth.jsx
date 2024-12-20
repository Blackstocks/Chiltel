import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuthActions } from "../hooks/useAuthActions";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RiderAuth = () => {
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Rider Portal</CardTitle>
					<CardDescription>Login or create a new rider account</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="login" className="w-full">
						<TabsList className="grid w-full grid-cols-2 mb-8">
							<TabsTrigger value="login">Login</TabsTrigger>
							<TabsTrigger value="signup">Sign Up</TabsTrigger>
						</TabsList>

						<TabsContent value="login">
							<LoginForm />
						</TabsContent>

						<TabsContent value="signup">
							<SignupForm />
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
};

const LoginForm = () => {
	const navigate = useNavigate();

	const { login } = useAuthActions();
	const { state } = useAuth();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await login(formData);
			// Redirect on success - use your router's navigation
			navigate("/");
		} catch (error) {
			// Error is handled by the context
			console.error("Login failed:", error);
		}
	};

	return (
		<form onSubmit={handleLogin} className="space-y-4">
			{state.error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{state.error}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					type="password"
					value={formData.password}
					onChange={handleChange}
					required
				/>
			</div>

			<Button type="submit" className="w-full" disabled={state.loading}>
				{state.loading ? "Signing in..." : "Sign in"}
			</Button>
		</form>
	);
};
const SignupForm = () => {
	const navigate = useNavigate();
	const { signup } = useAuthActions();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		phoneNumber: "",
		specialization: "",
		status: "OFFLINE", // Default value
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSpecializationChange = (value) => {
		setFormData((prev) => ({
			...prev,
			specialization: value,
		}));
	};

	const validateForm = () => {
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return false;
		}
		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters long");
			return false;
		}
		if (!formData.specialization) {
			setError("Please select a specialization");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setLoading(true);
		setError("");

		try {
			// Get current location
			const position = await getCurrentPosition();
			const signupData = {
				...formData,
				location: {
					type: "Point",
					coordinates: [position.coords.longitude, position.coords.latitude],
				},
			};
			delete signupData.confirmPassword; // Remove confirmPassword before sending

			await signup(signupData);
			navigate("/");
		} catch (err) {
			setError(err.message || "Failed to create account");
		} finally {
			setLoading(false);
		}
	};

	const getCurrentPosition = () => {
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				reject(new Error("Geolocation is not supported by your browser"));
				return;
			}

			navigator.geolocation.getCurrentPosition(resolve, reject, {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0,
			});
		});
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			{/* <CardHeader>
				<CardTitle>Create a Rider Account</CardTitle>
				<CardDescription>
					Enter your details to register as a service provider
				</CardDescription>
			</CardHeader> */}
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name</Label>
							<Input
								id="firstName"
								name="firstName"
								value={formData.firstName}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name</Label>
							<Input
								id="lastName"
								name="lastName"
								value={formData.lastName}
								onChange={handleChange}
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="phoneNumber">Phone Number</Label>
						<Input
							id="phoneNumber"
							name="phoneNumber"
							type="tel"
							value={formData.phoneNumber}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="specialization">Specialization</Label>
						<Select
							onValueChange={handleSpecializationChange}
							value={formData.specialization}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select your specialization" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="AC">AC Repair & Service</SelectItem>
								<SelectItem value="Cooler">Cooler Repair & Service</SelectItem>
								<SelectItem value="Microwave">
									Microwave Repair & Service
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm Password</Label>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							value={formData.confirmPassword}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label className="flex items-center space-x-2">
							<Input type="checkbox" className="w-4 h-4" required />
							<span className="text-sm text-gray-600">
								I agree to the Terms of Service and Privacy Policy
							</span>
						</Label>
					</div>

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Creating account..." : "Create account"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default RiderAuth;
