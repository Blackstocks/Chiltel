import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuthActions } from "../hooks/useAuthActions";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/SignUp";

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
					<CardTitle className="text-2xl font-bold">Partner Portal</CardTitle>
					<CardDescription>
						Login or create a new partner account
					</CardDescription>
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

export default RiderAuth;
