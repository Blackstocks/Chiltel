import { useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { ShopContext } from "../context/ShopContext";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import ModalLoader from "../components/ModalLoader";
import ServiceCartContext from "../context/ServiceCartContext";
import { useNavigate } from "react-router-dom";
import PdfViewerWindow from "./PdfViewer";

const ServiceModal = ({ isOpen, onClose, category }) => {
	if (!isOpen) return null;

	const { user } = useContext(AuthContext);
	const { backendUrl, token } = useContext(ShopContext);
	const { addToServiceCart } = useContext(ServiceCartContext);

	const navigate = useNavigate();

	const today = new Date();

	const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
	const [services, setServices] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [servicesLoading, setServicesLoading] = useState(true);
	const [expandedCategory, setExpandedCategory] = useState(null);
	const [scheduleService, setScheduleService] = useState(null);
	const [selectedDate, setSelectedDate] = useState("");
	const [selectedDay, setSelectedDay] = useState(
		today.toISOString().split("T")[0]
	); // Default to today
	const [selectedTime, setSelectedTime] = useState("");
	const [remarks, setRemarks] = useState("");
	const [address, setAddress] = useState({
		street: "",
		city: "",
		state: "",
		zipCode: "",
	});
	const [acMode, setAcMode] = useState("Split AC");
	const [serviceCounts, setServiceCounts] = useState({});

	const toggleAcMode = () => {
		setAcMode((prevMode) =>
			prevMode === "Split AC" ? "Window AC" : "Split AC"
		);
	};

	const openPDFInViewer = (pdfPath) => {
		setIsPdfViewerOpen(true);
	};

	console.log("Schedule service: ", scheduleService);

	const fetchStateByPincode = async (pincode) => {
		try {
			const response = await fetch(
				`https://api.postalpincode.in/pincode/${pincode}`
			);
			const data = await response.json();
			if (data[0].Status === "Success") {
				return data[0].PostOffice[0].State; // Get the state
			}
			return null;
		} catch (error) {
			console.error("Error fetching state:", error);
			return null;
		}
	};

	const handleZipCodeChange = async (e) => {
		const zipCode = e.target.value;
		setAddress((prev) => ({ ...prev, zipCode }));

		if (zipCode.length === 6) {
			const state = await fetchStateByPincode(zipCode);
			setAddress((prev) => ({ ...prev, state: state || "" })); // Auto-fill state
		}
	};

	// Fetch and organize services by product and category
	const fetchAndOrganizeServices = async () => {
		setServicesLoading(true);
		try {
			const response = await axios.get(`${backendUrl}/api/services/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.data.success) {
				const rawData = response.data.data;

				// Organize services into a structured object
				const organizedServices = {};
				rawData.forEach((item) => {
					if (!organizedServices[item.product]) {
						organizedServices[item.product] = {};
					}
					if (!organizedServices[item.product][item.category]) {
						organizedServices[item.product][item.category] = [];
					}
					organizedServices[item.product][item.category].push({
						_id: item._id,
						name: item.name,
						price: item.price,
						duration: item.estimatedDuration,
						description: item.description,
					});
				});
				console.log("organised services: ", organizedServices);
				setServices(organizedServices);
			} else {
				console.error("Error fetching services:", response.data.message);
			}
		} catch (err) {
			console.error("Error fetching services:", err);
		} finally {
			setServicesLoading(false);
		}
	};

	useEffect(() => {
		fetchAndOrganizeServices();
	}, []);

	const generateTimeSlots = () => {
		const slots = [];
		for (let hour = 9; hour <= 22; hour++) {
			slots.push(`${hour}:00`);
		}
		return slots;
	};

	const timeSlots = generateTimeSlots();

	// Utility function to convert 12-hour AM/PM to 24-hour format
	const convertTo24HourFormat = (time12hr) => {
		const [time, modifier] = time12hr.split(" ");
		let [hours, minutes] = time.split(":").map(Number);

		if (modifier === "PM" && hours !== 12) {
			hours += 12;
		} else if (modifier === "AM" && hours === 12) {
			hours = 0;
		}

		return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
			2,
			"0"
		)}`;
	};

	const incrementServiceCount = (serviceId) => {
		setServiceCounts((prevCounts) => ({
			...prevCounts,
			[serviceId]: (prevCounts[serviceId] || 0) + 1,
		}));
	};

	const decrementServiceCount = (serviceId) => {
		setServiceCounts((prevCounts) => ({
			...prevCounts,
			[serviceId]: Math.max((prevCounts[serviceId] || 0) - 1, 0),
		}));
	};

	const handleScheduleAllClick = () => {
		const servicesToSchedule = Object.entries(serviceCounts)
			.filter(([_, count]) => count > 0)
			.map(([serviceId, count]) => {
				const service = Object.values(services)
					.flatMap((product) => Object.values(product))
					.flat()
					.find((s) => s._id === serviceId);
				return {
					serviceId,
					count,
					price: service.price,
				};
			});

		if (servicesToSchedule.length === 0) {
			alert("Please select at least one service.");
			return;
		}

		setScheduleService({ services: servicesToSchedule });
	};

	const initPay = (order, newOrder) => {
		const options = {
			key: import.meta.env.VITE_RAZORPAY_KEY_ID,
			amount: order.amount,
			currency: order.currency,
			name: "Order Payment",
			description: "Order Payment",
			order_id: order.id,
			receipt: order.receipt,
			handler: async (response) => {
				console.log("init pay: ", response);
				try {
					const { data } = await axios.post(
						backendUrl + "/api/order/verifyRazorpay",
						response,
						{ headers: { Authorization: `Bearer ${token}` } }
					);
					// const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay',response,{headers:{token}})
					console.log("transaction data: ", data);
					if (data.success) {
						handleScheduleConfirm(response.razorpay_payment_id);
					}
				} catch (error) {
					console.log(error);
					toast.error(error);
				}
			},
			modal: {
				ondismiss: async () => {
					console.log("Payment window was closed by the user.");
					toast.error("Payment window closed. Cancelling the order...");

					// Cancel the order when the modal is closed
					try {
						await axios.post(
							`${backendUrl}/api/order/delete`,
							{ orderId: newOrder._id },
							{ headers: { Authorization: `Bearer ${token}` } }
						);
						console.log("Order canceled successfully");
					} catch (error) {
						console.error("Error while canceling order:", error);
						toast.error("Failed to cancel the order. Please contact support.");
					}
				},
			},
		};
		const rzp = new window.Razorpay(options);

		rzp.on("payment.failed", async (response) => {
			console.log("Payment failed or user closed dialog:", response);
			toast.error("Payment failed or was canceled by the user.");

			try {
				await axios.post(
					`${backendUrl}/api/order/delete`,
					{ orderId: newOrder._id },
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				console.log("Order canceled successfully");
			} catch (error) {
				console.error("Error while canceling order:", error);
				toast.error("Failed to cancel the order. Please contact support.");
			}
		});

		rzp.open();
	};

	const handlePayment = async () => {
		if (!selectedDay || !selectedTime) {
			alert("Please select both date and time.");
			return;
		}

		if (
			!address.street ||
			!address.city ||
			!address.state ||
			!address.zipCode
		) {
			alert("Please fill out all address fields.");
			return;
		}

		toast.info("Initiating Payment");
		try {
			console.log("order services: ", services);
			const totalPrice = scheduleService.services.reduce(
				(sum, service) => sum + service.price * service.count,
				0
			);

			console.log("user: ", user);
			let orderData = {
				userId: user._id,
				orderType: "service",
				products: [],
				services: [],
				totalAmount: (totalPrice * 1.18).toFixed(2),
				// totalAmount: serviceRequest.price,
				status: "ORDERED",
				paymentDetails: {
					method: "Razorpay",
					transactionId: "",
					paidAt: new Date(),
				},
				address: {
					street: address.street,
					city: address.city,
					state: address.state,
					zipCode: address.zipCode,
				},
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			console.log("order data: ", orderData);
			const responseRazorpay = await axios.post(
				backendUrl + "/api/order/razorpay",
				orderData,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			// const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, {headers:{token}})
			console.log(responseRazorpay);
			if (responseRazorpay.data.success) {
				console.log("razorpay init success");
				console.log("razorpay response: ", responseRazorpay.data);
				initPay(responseRazorpay.data.order, responseRazorpay.data.newOrder);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const handleScheduleConfirm = async (paymentId) => {
		try {
			const time24hr = convertTo24HourFormat(selectedTime);
			const scheduledDateTime = new Date(
				`${selectedDay}T${time24hr}:00`
			).toISOString();

			const totalPrice = scheduleService.services.reduce(
				(sum, service) => sum + service.price * service.count,
				0
			);

			const serviceRequest = {
				user: user._id,
				services: scheduleService.services,
				userLocation: {
					type: "Point",
					coordinates: [0.0, 0.0], // Replace with actual coordinates if available
					address: `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}`,
				},
				scheduledFor: scheduledDateTime,
				remarks,
				totalPrice,
				paymentId,
			};

			await addToServiceCart(scheduleService.services, serviceRequest);
			onClose();
		} catch (err) {
			console.error("Error scheduling service:", err);
			toast.error("An error occurred while scheduling the service.");
		}
	};

	const renderServiceCard = (service, categoryName, productName) => {
		const serviceCount = serviceCounts[service._id] || 0;

		if (productName.includes("Air Conditioner")) {
			return (
				<>
					{acMode === "Split AC" && !service.name.includes("Window AC") && (
						<div className="p-4 transition-shadow bg-white border rounded-lg hover:shadow-md">
							<div className="flex items-start justify-between">
								<div className="flex-grow">
									<h3 className="text-lg font-semibold text-gray-800">
										{service.name}
									</h3>
									<p className="mt-1 text-sm text-gray-600">
										{service.description}
									</p>
									<div className="flex items-center gap-4 mt-2">
										<div className="flex items-center text-gray-500">
											<Clock className="w-4 h-4 mr-1" />
											<span className="text-sm">{service.duration}</span>
										</div>
										<div className="font-medium text-gray-900">
											₹{service.price}
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<button
										onClick={() => decrementServiceCount(service._id)}
										className="px-2 py-1 text-sm text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white"
									>
										-
									</button>
									<span>{serviceCount}</span>
									<button
										onClick={() => incrementServiceCount(service._id)}
										className="px-2 py-1 text-sm text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white"
									>
										+
									</button>
								</div>
							</div>
						</div>
					)}
					{acMode === "Window AC" && !service.name.includes("Split AC") && (
						<div className="p-4 transition-shadow bg-white border rounded-lg hover:shadow-md">
							<div className="flex items-start justify-between">
								<div className="flex-grow">
									<h3 className="text-lg font-semibold text-gray-800">
										{service.name}
									</h3>
									<p className="mt-1 text-sm text-gray-600">
										{service.description}
									</p>
									<div className="flex items-center gap-4 mt-2">
										<div className="flex items-center text-gray-500">
											<Clock className="w-4 h-4 mr-1" />
											<span className="text-sm">{service.duration}</span>
										</div>
										<div className="font-medium text-gray-900">
											₹
											{categoryName === "Installation"
												? service.price
												: service.price + 300}
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<button
										onClick={() => decrementServiceCount(service._id)}
										className="px-2 py-1 text-sm text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white"
									>
										-
									</button>
									<span>{serviceCount}</span>
									<button
										onClick={() => incrementServiceCount(service._id)}
										className="px-2 py-1 text-sm text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white"
									>
										+
									</button>
								</div>
							</div>
						</div>
					)}
				</>
			);
		}

		// Default rendering for other product names
		return (
			<div className="p-4 transition-shadow bg-white border rounded-lg hover:shadow-md">
				<div className="flex items-start justify-between">
					<div className="flex-grow">
						<h3 className="text-lg font-semibold text-gray-800">
							{service.name}
						</h3>
						<p className="mt-1 text-sm text-gray-600">{service.description}</p>
						<div className="flex items-center gap-4 mt-2">
							<div className="flex items-center text-gray-500">
								<Clock className="w-4 h-4 mr-1" />
								<span className="text-sm">{service.duration}</span>
							</div>
							<div className="font-medium text-gray-900">₹{service.price}</div>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<button
							onClick={() => decrementServiceCount(service._id)}
							className="px-2 py-1 text-sm text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white"
						>
							-
						</button>
						<span>{serviceCount}</span>
						<button
							onClick={() => incrementServiceCount(service._id)}
							className="px-2 py-1 text-sm text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white"
						>
							+
						</button>
					</div>
				</div>
			</div>
		);
	};

	const renderProductServices = (productName) => (
		<div className="space-y-4">
			{Object.entries(services[productName] || {}).map(
				([categoryName, categoryServices]) => (
					<div key={categoryName} className="overflow-hidden border rounded-lg">
						<button
							onClick={() =>
								setExpandedCategory(
									expandedCategory === categoryName ? null : categoryName
								)
							}
							className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100"
						>
							<span className="font-semibold">{categoryName}</span>
							{expandedCategory === categoryName ? (
								<ChevronUp />
							) : (
								<ChevronDown />
							)}
						</button>
						{expandedCategory === categoryName && (
							<div className="p-4 space-y-4 bg-gray-50">
								{categoryServices.map((service, idx) => (
									<div key={idx}>
										{renderServiceCard(service, categoryName, productName)}
									</div>
								))}
							</div>
						)}
					</div>
				)
			)}
		</div>
	);

	const renderScheduleModal = () => {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);
		const dayAfterTomorrow = new Date(today);
		dayAfterTomorrow.setDate(today.getDate() + 2);

		// Calculate valid time slots
		const getValidTimeSlots = () => {
			const allSlots = [
				"08:00 AM",
				"09:00 AM",
				"10:00 AM",
				"11:00 AM",
				"12:00 PM",
				"01:00 PM",
				"02:00 PM",
				"03:00 PM",
				"04:00 PM",
				"05:00 PM",
				"06:00 PM",
				"07:00 PM",
				"08:00 PM",
			];
			if (selectedDay === today.toISOString().split("T")[0]) {
				const currentTime = new Date();
				currentTime.setHours(currentTime.getHours() + 4); // Add 4-hour buffer
				const currentHour = currentTime.getHours();
				const validSlots = allSlots.filter((slot) => {
					const slotHour = parseInt(slot.split(":")[0], 10);
					const isPM = slot.includes("PM");
					const adjustedHour =
						isPM && slotHour !== 12 ? slotHour + 12 : slotHour; // Convert to 24-hour format
					return adjustedHour >= currentHour;
				});
				return validSlots;
			}
			return allSlots; // Return all slots for tomorrow and day after
		};

		const validTimeSlots = getValidTimeSlots();

		const totalPrice = scheduleService.services.reduce(
			(sum, service) => sum + service.price * service.count,
			0
		);

		const totalServices = scheduleService.services.reduce(
			(sum, service) => sum + service.count,
			0
		);

		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
				<div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
					<div className="flex items-center justify-between sticky top-0 z-10 ">
						{/* <div className="flex items-center space-x-4"> */}
						<div className="flex items-center space-x-4">
							<h2 className="text-lg font-bold">Schedule Service</h2>
						</div>
						<button
							onClick={() => openPDFInViewer(`/rate_charts/ac_rate_chart.pdf`)}
							className="flex items-center px-4 py-2 text-sm font-medium text-blue-500 bg-white rounded-md shadow-md hover:bg-blue-100 hover:shadow-lg"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-4 h-4 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8m-4-6l4 4m-4-4v4h4"
								/>
							</svg>
							View Rate Chart
						</button>
					</div>
					{isPdfViewerOpen && (
						<PdfViewerWindow pdfPath={`/rate_charts/ac_rate_chart.pdf`} />
					)}
					<div className="mt-4 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto p-6">
						{/* Day Selection */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Select Day
							</label>
							<div className="grid grid-cols-3 gap-2 mt-2">
								{[today, tomorrow, dayAfterTomorrow].map((date, idx) => (
									<button
										key={idx}
										className={`px-4 py-2 border rounded-md ${
											selectedDay === date.toISOString().split("T")[0]
												? "bg-black text-white"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										}`}
										onClick={() =>
											setSelectedDay(date.toISOString().split("T")[0])
										}
									>
										{idx === 0 ? "Today" : idx === 1 ? "Tomorrow" : "Day After"}
									</button>
								))}
							</div>
						</div>

						{/* Time Slot Selection */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Select Time
							</label>
							<div className="grid grid-cols-4 gap-2 mt-2">
								{validTimeSlots.map((slot, idx) => (
									<button
										key={idx}
										className={`px-4 py-2 border rounded-md ${
											selectedTime === slot
												? "bg-black text-white"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										}`}
										onClick={() => setSelectedTime(slot)}
									>
										{slot}
									</button>
								))}
							</div>
						</div>

						{/* Address Input */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Address
							</label>
							<div className="mt-4 space-y-4">
								<input
									type="text"
									className="w-full px-4 py-2 border rounded-md"
									placeholder="Street"
									value={address.street}
									onChange={(e) =>
										setAddress((prev) => ({ ...prev, street: e.target.value }))
									}
								/>
								<input
									type="text"
									className="w-full px-4 py-2 border rounded-md"
									placeholder="City"
									value={address.city}
									onChange={(e) =>
										setAddress((prev) => ({ ...prev, city: e.target.value }))
									}
								/>
								<input
									type="number"
									className="w-full px-4 py-2 border rounded-md"
									placeholder="PIN Code"
									value={address.zipCode}
									onChange={handleZipCodeChange}
								/>
								<p className="mt-2 text-sm text-gray-700">
									State:{" "}
									{address.state || "Enter a valid PIN code to auto-fill"}
								</p>
							</div>
						</div>

						{/* Remarks */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Remarks
							</label>
							<input
								type="text"
								className="w-full px-4 py-2 mt-1 border rounded-md"
								value={remarks}
								onChange={(e) => setRemarks(e.target.value)}
							/>
						</div>

						{/* Total Price and Services */}
						<div className="mt-4">
							<p className="text-lg font-semibold">
								Total Price: ₹{(totalPrice * 1.18).toFixed(2)} (Incl. 18% GST)
							</p>
							<p className="text-sm text-gray-700">
								Number of Services: {totalServices}
							</p>
						</div>
					</div>
					<div className="flex items-center justify-end gap-4 mt-6">
						<button
							onClick={() => {
								setScheduleService(null);
								setAddress({
									street: "",
									city: "",
									state: "",
									zipCode: "",
								});
								setRemarks("");
								setSelectedDate("");
								setSelectedDay(today.toISOString().split("T")[0]);
								setSelectedTime("");
								setIsPdfViewerOpen(false);
							}}
							className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
						>
							Cancel
						</button>
						<button
							onClick={() => handlePayment()}
							className="px-4 py-2 text-sm text-white bg-black rounded-md hover:bg-gray-800"
						>
							Confirm & Pay
						</button>
					</div>
				</div>
			</div>
		);
	};

	const openPDF = (pdfPath) => {
		const pdfUrl = `${window.location.origin}${pdfPath}`;
		window.open(pdfUrl, "_blank", "noopener,noreferrer");
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="relative w-full max-w-3xl mx-4 my-6 bg-white rounded-lg shadow-xl">
				<div className="flex items-center justify-between sticky top-0 z-10 p-6 shadow-md rounded-t-lg">
					<h2 className="text-2xl font-semibold tracking-wide">
						{category?.name} Services
					</h2>
					<div className="flex space-x-4">
						<div className="flex items-center space-x-4">
							{category?.name === "Air Conditioner" && (
								<>
									<span className="text-sm font-medium">{acMode}</span>
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											className="sr-only peer"
											checked={acMode === "Window AC"}
											onChange={toggleAcMode}
										/>
										<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-500 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
									</label>
								</>
							)}
						</div>

						<button
							onClick={onClose}
							className="p-2 text-black-200 transition-colors bg-white rounded-full shadow-md hover:bg-gray-100 hover:shadow-lg"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>

				<div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6">
					{servicesLoading && <ModalLoader />}
					{renderProductServices(category?.name || "Unknown")}
				</div>
				<div className="flex items-center justify-end gap-4 p-6">
					<button
						onClick={handleScheduleAllClick}
						className="px-4 py-2 text-sm text-white bg-black rounded-md hover:bg-gray-800"
					>
						Schedule All
					</button>
				</div>
			</div>
			{scheduleService && renderScheduleModal()}
		</div>
	);
};

export default ServiceModal;
