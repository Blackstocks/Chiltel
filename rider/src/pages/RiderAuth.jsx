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
import { toast } from "react-toastify";

const RiderAuth = () => {
	const { state } = useAuth();
	const navigate = useNavigate();

	if (state.token) {
		navigate("/");
	}
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
		specializations: [], // Changed to array for multiple selections
		status: "OFFLINE", // Default value
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSpecializationChange = (e) => {
		const { value, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			specializations: checked
				? [...prev.specializations, value]
				: prev.specializations.filter((spec) => spec !== value),
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
		if (formData.specializations.length === 0) {
			setError("Please select at least one specialization");
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
			//empty form data
			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				password: "",
				confirmPassword: "",
				phoneNumber: "",
				specializations: [],
			});

			toast.success("Account created successfully. Please login to continue.");
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
						<Label>Specializations</Label>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="ac"
									value="AC"
									checked={formData.specializations.includes("AC")}
									onChange={handleSpecializationChange}
									className="w-4 h-4"
								/>
								<Label htmlFor="ac">AC Repair & Service</Label>
							</div>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="cooler"
									value="Cooler"
									checked={formData.specializations.includes("Cooler")}
									onChange={handleSpecializationChange}
									className="w-4 h-4"
								/>
								<Label htmlFor="cooler">Cooler Repair & Service</Label>
							</div>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="microwave"
									value="Microwave"
									checked={formData.specializations.includes("Microwave")}
									onChange={handleSpecializationChange}
									className="w-4 h-4"
								/>
								<Label htmlFor="microwave">Microwave Repair & Service</Label>
							</div>
						</div>
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
