import { useState } from "react";
import { Store, Building2, Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-toastify";

const SignupForm = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	// Separate states for each form section
	const [authData, setAuthData] = useState({
		email: "",
		password: "",
	});

	const [storeData, setStoreData] = useState({
		shopName: "",
		proprietorName: "",
		aadharNumber: "",
		phoneNumber: "",
	});

	const [registeredAddress, setRegisteredAddress] = useState({
		street: "",
		city: "",
		state: "",
		pincode: "",
	});

	const [warehouseAddress, setWarehouseAddress] = useState({
		street: "",
		city: "",
		state: "",
		pincode: "",
	});

	// Simplified change handlers
	function handleAuthChange(event) {
		const { name, value } = event.target;
		console.log(name, value);
		setAuthData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	function handleStoreChange(event) {
		const { name, value } = event.target;
		setStoreData((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	function handleRegisteredAddressChange(event) {
		const { name, value } = event.target;
		setRegisteredAddress((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	function handleWarehouseAddressChange(event) {
		const { name, value } = event.target;
		setWarehouseAddress((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	const validateStep = (step) => {
		switch (step) {
			case 1:
				return authData.email && authData.password;
			case 2:
				return Object.values(storeData).every(Boolean);
			case 3:
				return Object.values(registeredAddress).every(Boolean);
			case 4:
				return Object.values(warehouseAddress).every(Boolean);
			default:
				return false;
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const formData = {
				...authData,
				...storeData,
				registeredAddress,
				warehouseAddress,
			};

			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/seller/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Registration failed");
			}

			toast.success(
				"After verification by our admin team, you will receive an email with your login credentials.",
				{
					position: "top-right",
					autoClose: 5000,
				}
			);

			window.location.href = "/registration-submitted";
		} catch (err) {
			setError(err.message);
			toast.error("Registration Failed: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	const AuthenticationSection = () => (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Store className="h-5 w-5" />
				<h3 className="font-semibold">Authentication Details</h3>
			</div>

			<div className="grid gap-4">
				<div className="space-y-2">
					<Label htmlFor="email">Email Address</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="Enter your email"
						value={authData.email}
						onChange={handleAuthChange}
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<div className="relative">
						<Input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							placeholder="Enter your password"
							value={authData.password}
							onChange={handleAuthChange}
							required
							className="pr-10"
							autoComplete="on"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 transform -translate-y-1/2"
						>
							{showPassword ? (
								<EyeOff className="h-4 w-4 text-gray-500" />
							) : (
								<Eye className="h-4 w-4 text-gray-500" />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	const StoreSection = () => (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Store className="h-5 w-5" />
				<h3 className="font-semibold">Store Information</h3>
			</div>

			<div className="grid gap-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="shopName">Firm/Shop Name</Label>
						<Input
							id="shopName"
							name="shopName"
							placeholder="Enter shop name"
							value={storeData.shopName}
							onChange={handleStoreChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="proprietorName">Proprietor Name</Label>
						<Input
							id="proprietorName"
							name="proprietorName"
							placeholder="Enter proprietor name"
							value={storeData.proprietorName}
							onChange={handleStoreChange}
							required
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="aadharNumber">Aadhar Card Number</Label>
						<Input
							id="aadharNumber"
							name="aadharNumber"
							placeholder="Enter Aadhar number"
							value={storeData.aadharNumber}
							onChange={handleStoreChange}
							required
							maxLength={12}
							pattern="\d{12}"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phoneNumber">Contact Number</Label>
						<Input
							id="phoneNumber"
							name="phoneNumber"
							type="tel"
							placeholder="Enter phone number"
							value={storeData.phoneNumber}
							onChange={handleStoreChange}
							required
							maxLength={10}
							pattern="\d{10}"
						/>
					</div>
				</div>
			</div>
		</div>
	);

	const RegisteredAddressSection = () => (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Building2 className="h-5 w-5" />
				<h3 className="font-semibold">Registered Address</h3>
			</div>

			<div className="grid gap-4">
				<div className="space-y-2">
					<Label htmlFor="street">Street Address</Label>
					<Input
						id="street"
						name="street"
						placeholder="Enter street address"
						value={registeredAddress.street}
						onChange={handleRegisteredAddressChange}
						required
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="city">City</Label>
						<Input
							id="city"
							name="city"
							placeholder="Enter city"
							value={registeredAddress.city}
							onChange={handleRegisteredAddressChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="state">State</Label>
						<Input
							id="state"
							name="state"
							placeholder="Enter state"
							value={registeredAddress.state}
							onChange={handleRegisteredAddressChange}
							required
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="pincode">Pincode</Label>
					<Input
						id="pincode"
						name="pincode"
						placeholder="Enter pincode"
						value={registeredAddress.pincode}
						onChange={handleRegisteredAddressChange}
						required
						maxLength={6}
						pattern="\d{6}"
					/>
				</div>
			</div>
		</div>
	);

	const WarehouseAddressSection = () => (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Store className="h-5 w-5" />
				<h3 className="font-semibold">Warehouse Address</h3>
			</div>

			<div className="grid gap-4">
				<div className="space-y-2">
					<Label htmlFor="w-street">Street Address</Label>
					<Input
						id="w-street"
						name="street"
						placeholder="Enter street address"
						value={warehouseAddress.street}
						onChange={handleWarehouseAddressChange}
						required
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="w-city">City</Label>
						<Input
							id="w-city"
							name="city"
							placeholder="Enter city"
							value={warehouseAddress.city}
							onChange={handleWarehouseAddressChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="w-state">State</Label>
						<Input
							id="w-state"
							name="state"
							placeholder="Enter state"
							value={warehouseAddress.state}
							onChange={handleWarehouseAddressChange}
							required
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="w-pincode">Pincode</Label>
					<Input
						id="w-pincode"
						name="pincode"
						placeholder="Enter pincode"
						value={warehouseAddress.pincode}
						onChange={handleWarehouseAddressChange}
						required
						maxLength={6}
						pattern="\d{6}"
					/>
				</div>
			</div>
		</div>
	);

	return (
		<div className="flex flex-col max-h-[70vh] relative">
			<div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth scrollbar-thin">
				<form id="registrationForm" onSubmit={handleSubmit}>
					{currentStep === 1 && <AuthenticationSection />}
					{currentStep === 2 && <StoreSection />}
					{currentStep === 3 && <RegisteredAddressSection />}
					{currentStep === 4 && <WarehouseAddressSection />}

					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
				</form>
			</div>

			<div className="sticky bottom-0 bg-white border-t p-4 mt-auto">
				<div className="flex gap-4">
					{currentStep > 1 && (
						<Button
							type="button"
							onClick={() => {
								setCurrentStep((prev) => Math.max(prev - 1, 1));
								setError("");
							}}
							className="flex-1"
							variant="outline"
						>
							Previous
						</Button>
					)}

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={() => {
                if (validateStep(currentStep)) {
                  setCurrentStep((prev) => Math.min(prev + 1, 4));
                  setError("");
                } else {
                  setError(
                    "Please fill in all required fields before proceeding."
                  );
                }
              }}
              className="flex-1"
            >
              Next
            </Button>
          ) : (
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Input type="checkbox" className="w-4 h-4" required />
                  <span className="text-sm text-gray-600">
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </Label>
              </div>
              <Button
                type="submit"
                form="registrationForm"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Registration...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
