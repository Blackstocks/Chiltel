import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	AlertCircle,
	Upload,
} from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const MultiStepSignupForm = () => {
	const fileInputRef = useRef(null);

	// Initial form state
	const [formData, setFormData] = useState({
		// Mode Selection
		mode: "normal",
		referralCode: "",

		// Personal Details
		firstName: "",
		lastName: "",
		fullName: "",
		fatherName: "",
		dob: "",
		email: "",
		phoneNumber: "",

		// Profile Picture
		profilePhoto: null,
		profilePhotoPreview: null,

		// Address Details
		address: "",
		state: "",
		city: "",
		pincode: "",

		// Professional Details
		specializations: [],

		// Authentication
		password: "",
		confirmPassword: "",

		// Bank Details
		panNumber: "",
		beneficiaryAccount: "",
		beneficiaryIFSC: "",
		beneficiaryMobile: "",
		beneficiaryName: "",
	});

	// Form state management
	const [currentStep, setCurrentStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [paymentOrder, setPaymentOrder] = useState(null);

	// Specializations list
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

	// Input change handler
	const handleChange = useCallback((e) => {
		const { name, value, type, files, checked } = e.target;

		if (type === "file" && files && files[0]) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData((prev) => ({
					...prev,
					profilePhoto: files[0],
					profilePhotoPreview: reader.result,
				}));
			};
			reader.readAsDataURL(files[0]);
		} else if (type === "checkbox") {
			setFormData((prev) => ({
				...prev,
				[name]: checked,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	}, []);

	// Specialization toggle
	const handleSpecializationToggle = useCallback((value) => {
		setFormData((prev) => ({
			...prev,
			specializations: prev.specializations.includes(value)
				? prev.specializations.filter((spec) => spec !== value)
				: [...prev.specializations, value],
		}));
	}, []);

	// Mode change handler
	const handleModeChange = useCallback((selectedMode) => {
		setFormData((prev) => ({
			...prev,
			mode: selectedMode,
			// Reset referral code if changing modes
			referralCode: selectedMode === "normal" ? prev.referralCode : "",
		}));
	}, []);

	// Step validation logic
	const validateStep = useCallback(
		(step) => {
			switch (step) {
				case 1: // Mode Selection
					return (
						formData.mode &&
						(formData.mode !== "normal" || formData.referralCode.trim() !== "")
					);

				case 2: // Personal Details
					return (
						formData.firstName.trim() !== "" &&
						formData.lastName.trim() !== "" &&
						formData.email.trim() !== "" &&
						formData.phoneNumber.trim() !== ""
					);

				case 3: // Additional Personal Details
					return (
						formData.dob &&
						formData.fatherName.trim() !== "" &&
						formData.profilePhoto
					);

				case 4: // Address Details
					return (
						formData.address.trim() !== "" &&
						formData.state.trim() !== "" &&
						formData.city.trim() !== "" &&
						formData.pincode.trim() !== ""
					);

				case 5: // Professional Details
					return formData.specializations.length > 0;

				case 6: // Authentication
					return (
						formData.password.trim() !== "" &&
						formData.confirmPassword.trim() !== "" &&
						formData.password === formData.confirmPassword &&
						formData.password.length >= 6
					);

				case 7: // Bank & Legal Details
					return (
						formData.panNumber.trim() !== "" &&
						formData.beneficiaryAccount.trim() !== "" &&
						formData.beneficiaryIFSC.trim() !== "" &&
						formData.beneficiaryName.trim() !== ""
					);

				default:
					return false;
			}
		},
		[formData]
	);

	// Next step handler
	const nextStep = useCallback(() => {
		if (validateStep(currentStep)) {
			setCurrentStep((prev) => Math.min(prev + 1, 8));
			setError("");
		} else {
			setError(`Please complete all required fields in step ${currentStep}`);
		}
	}, [currentStep, validateStep]);

	// Previous step handler
	const prevStep = useCallback(() => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
		setError("");
	}, []);

	// Payment creation
	const handlePayment = async () => {
		try {
			// Simulate payment order creation
			const order = {
				id: `order_${Date.now()}`,
				amount: 200000, // ₹2000 in paisa
				currency: "INR",
			};
			setPaymentOrder(order);
			return order;
		} catch (error) {
			console.error("Payment order creation failed", error);
			setError("Failed to create payment order");
			return null;
		}
	};

	// Payment initiation
	const initiatePay = (order) => {
		const options = {
			key: import.meta.env.VITE_RAZORPAY_KEY_ID,
			amount: order.amount,
			currency: order.currency,
			name: "Service Provider Registration",
			description: "Registration Fee",
			order_id: order.id,
			handler: async (response) => {
				try {
					// Simulate payment verification
					if (response.razorpay_payment_id) {
						// Complete signup
						await completeSignup(response.razorpay_payment_id);
						alert("Account created successfully");
					} else {
						alert("Payment verification failed");
					}
				} catch (error) {
					console.error("Payment verification failed", error);
					alert("Payment verification failed");
				}
			},
			prefill: {
				name: `${formData.firstName} ${formData.lastName}`,
				email: formData.email,
				contact: formData.phoneNumber,
			},
		};

		const rzp = new window.Razorpay(options);
		rzp.open();
	};

	// Complete signup
	const completeSignup = async (paymentId = null) => {
		setLoading(true);
		try {
			// Prepare signup data
			const signupData = {
				...formData,
				paymentId,
				// Remove sensitive fields
				confirmPassword: undefined,
				profilePhotoPreview: undefined,
			};

			// Simulate signup (replace with actual signup logic)
			console.log("Signup Data:", signupData);

			// Show success message
			alert("Account created successfully");
		} catch (error) {
			console.error("Signup failed", error);
			alert("Signup failed");
		} finally {
			setLoading(false);
		}
	};

	// Form submission handler
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate all steps
		for (let step = 1; step <= 7; step++) {
			if (!validateStep(step)) {
				setCurrentStep(step);
				setError(`Please complete all required fields in step ${step}`);
				return;
			}
		}

		// If in commission mode, initiate payment
		if (formData.mode === "commission") {
			const order = await handlePayment();
			if (order) {
				initiatePay(order);
			}
		} else {
			// Direct signup for normal mode
			await completeSignup();
		}
	};

	// Placeholder for step content rendering
	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-4">
						<h2 className="text-xl font-bold">Mode Selection</h2>
						<RadioGroup
							value={formData.mode}
							onValueChange={handleModeChange}
							className="flex space-x-4"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="normal" id="normal" />
								<Label htmlFor="normal">Normal Mode</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="commission" id="commission" />
								<Label htmlFor="commission">Commission Mode</Label>
							</div>
						</RadioGroup>

						{formData.mode === "normal" && (
							<div className="space-y-2">
								<Label htmlFor="referralCode">Referral Code</Label>
								<Input
									id="referralCode"
									name="referralCode"
									value={formData.referralCode}
									onChange={handleChange}
									required
								/>
								<p className="text-sm text-gray-500">
									Please enter a referral code to proceed.
								</p>
							</div>
						)}

						{formData.mode === "commission" && (
							<p className="text-sm text-gray-500">
								You will need to pay a commission fee to proceed.
							</p>
						)}
					</div>
				);
			case 2:
				return (
					<div className="space-y-4">
						<h2 className="text-xl font-bold">Personal Details</h2>
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
					</div>
				);
			case 3:
				return (
					<div className="space-y-4">
						<h2 className="text-xl font-bold">Additional Personal Details</h2>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="fatherName">Father's Name</Label>
								<Input
									id="fatherName"
									name="fatherName"
									value={formData.fatherName}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="dob">Date of Birth</Label>
								<Input
									id="dob"
									name="dob"
									type="date"
									value={formData.dob}
									onChange={handleChange}
									required
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="profilePhoto">Profile Picture</Label>
							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									onClick={() => fileInputRef.current.click()}
								>
									<Upload className="h-4 w-4" /> Upload
								</Button>
								<span>{formData.profilePhoto?.name || "No file chosen"}</span>
							</div>
							<input
								type="file"
								id="profilePhoto"
								name="profilePhoto"
								ref={fileInputRef}
								onChange={handleChange}
								accept="image/*"
								hidden
							/>
							{formData.profilePhotoPreview && (
								<img
									src={formData.profilePhotoPreview}
									alt="Profile Preview"
									className="mt-2 h-24 w-24 object-cover rounded-full"
								/>
							)}
						</div>
					</div>
				);

			case 4:
				return (
					<div className="space-y-4">
						<h2 className="text-xl font-bold">Address Details</h2>
						<div className="space-y-2">
							<Label htmlFor="address">Address</Label>
							<Input
								id="address"
								name="address"
								value={formData.address}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="state">State</Label>
								<Input
									id="state"
									name="state"
									value={formData.state}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="city">City</Label>
								<Input
									id="city"
									name="city"
									value={formData.city}
									onChange={handleChange}
									required
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="pincode">Pincode</Label>
							<Input
								id="pincode"
								name="pincode"
								type="number"
								value={formData.pincode}
								onChange={handleChange}
								required
							/>
						</div>
					</div>
				);

			case 5:
				return (
					<div className="space-y-4">
						<h2 className="text-xl font-bold">Professional Details</h2>
						<div className="space-y-2">
							<Label>Specializations</Label>
							<div className="grid grid-cols-2 gap-4">
								{specializations.map((spec) => (
									<div key={spec.value} className="flex items-center space-x-2">
										<Checkbox
											id={spec.value}
											checked={formData.specializations.includes(spec.value)}
											onCheckedChange={() =>
												handleSpecializationToggle(spec.value)
											}
										/>
										<Label htmlFor={spec.value}>{spec.label}</Label>
									</div>
								))}
							</div>
						</div>
					</div>
				);

			case 6:
				return (
					<div className="space-y-4">
						<h2 className="text-xl font-bold">Authentication</h2>
						<div className="grid grid-cols-2 gap-4">
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
						</div>
					</div>
				);

			case 7:
				return (
					<div className="space-y-4">
						<h2 className="text-xl font-bold">Bank & Legal Details</h2>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="panNumber">PAN Number</Label>
								<Input
									id="panNumber"
									name="panNumber"
									value={formData.panNumber}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="beneficiaryAccount">
									Beneficiary Account Number
								</Label>
								<Input
									id="beneficiaryAccount"
									name="beneficiaryAccount"
									type="number"
									value={formData.beneficiaryAccount}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="beneficiaryIFSC">Beneficiary IFSC Code</Label>
								<Input
									id="beneficiaryIFSC"
									name="beneficiaryIFSC"
									value={formData.beneficiaryIFSC}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="beneficiaryMobile">
									Beneficiary Mobile Number
								</Label>
								<Input
									id="beneficiaryMobile"
									name="beneficiaryMobile"
									type="tel"
									value={formData.beneficiaryMobile}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="beneficiaryName">Beneficiary Name</Label>
								<Input
									id="beneficiaryName"
									name="beneficiaryName"
									value={formData.beneficiaryName}
									onChange={handleChange}
									required
								/>
							</div>
						</div>

						<div className="flex content-center items-center">
							<Checkbox
								id="agreeToVerify"
								checked={formData.agreeToVerify}
								onChange={handleChange}
								required
							/>
							<Label htmlFor="agreeToVerify">
								I agree to verify my court cases and bank details
							</Label>
						</div>
					</div>
				);

			// Add other step rendering logic similarly...
			default:
				return null;
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="text-center">Form Progress</CardTitle>
				<Progress
					value={(currentStep - 1) * (100 / 7)}
					className="w-full mt-2"
				/>
			</CardHeader>

			<CardContent>
				{error && (
					<Alert variant="destructive" className="mb-4">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					{renderStepContent()}

					<div className="flex justify-between mt-6">
						{currentStep > 1 && (
							<Button
								type="button"
								variant="outline"
								onClick={prevStep}
								disabled={loading}
							>
								<ChevronLeft className="mr-2 h-4 w-4" /> Previous
							</Button>
						)}

						{currentStep < 7 ? (
							<Button
								type="button"
								onClick={nextStep}
								className="ml-auto"
								disabled={loading}
							>
								Next <ChevronRight className="ml-2 h-4 w-4" />
							</Button>
						) : (
							<Button type="submit" className="ml-auto" disabled={loading}>
								{loading
									? formData.mode === "commission"
										? "Processing Payment..."
										: "Submitting..."
									: formData.mode === "commission"
									? "Pay & Create Account"
									: "Create Account"}
							</Button>
						)}
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default MultiStepSignupForm;
