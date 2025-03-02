import { useRef, useState, useEffect } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";

const ProductOrderChalan = ({ order }) => {
	const [serialNumbers, setSerialNumbers] = useState(
		order.products.map(() => "")
	);

	const [showChalan, setShowChalan] = useState(false);
	const printRef = useRef();

	const [hsnNumbers, setHsnNumbers] = useState(
		order.products.map(() => "84183010") // Default HSN code
	);

	// 2. Add useEffect to load HSN numbers from localStorage (right after the existing useEffect)
	useEffect(() => {
		const storedHsnNumbers = localStorage.getItem(`hsn_numbers_${order._id}`);
		if (storedHsnNumbers) {
			setHsnNumbers(JSON.parse(storedHsnNumbers));
		}
	}, [order._id]);

	// 3. Add a function to handle HSN number changes
	const handleHsnNumberChange = (index, value) => {
		const newHsnNumbers = [...hsnNumbers];
		newHsnNumbers[index] = value;
		setHsnNumbers(newHsnNumbers);
		// Save to localStorage
		localStorage.setItem(
			`hsn_numbers_${order._id}`,
			JSON.stringify(newHsnNumbers)
		);
	};

	// Load serial numbers from localStorage on component mount
	useEffect(() => {
		const storedSerialNumbers = localStorage.getItem(
			`serial_numbers_${order._id}`
		);
		if (storedSerialNumbers) {
			setSerialNumbers(JSON.parse(storedSerialNumbers));
			// If we have stored serial numbers, check if they're all filled to show chalan
			const parsedNumbers = JSON.parse(storedSerialNumbers);
			const allFilled = parsedNumbers.every((num) => num.trim() !== "");
			setShowChalan(allFilled);
		} else {
			// Initialize with empty strings if no stored values
			setSerialNumbers(
				order.products.reduce((acc, product) => {
					return [...acc, ...Array(product.quantity).fill("")];
				}, [])
			);
		}
	}, [order._id, order.products]);

	const handleSerialNumberChange = (index, value) => {
		const newSerialNumbers = [...serialNumbers];
		newSerialNumbers[index] = value;
		setSerialNumbers(newSerialNumbers);
		// Save to localStorage whenever serial numbers change
		localStorage.setItem(
			`serial_numbers_${order._id}`,
			JSON.stringify(newSerialNumbers)
		);
	};

	const handleProceed = () => {
		let allFilled = true;
		let allHsnFilled = true;

		for (let i = 0; i < order.products.length; i++) {
			// Check serial numbers
			for (let j = 0; j < order.products[i].quantity; j++) {
				if (serialNumbers[i * order.products[i].quantity + j].trim() === "") {
					allFilled = false;
					break;
				}
			}

			// Check HSN numbers
			if (hsnNumbers[i].trim() === "") {
				allHsnFilled = false;
				break;
			}
		}

		if (allFilled && allHsnFilled) {
			setShowChalan(true);
		} else {
			if (!allFilled) {
				alert("Please fill serial numbers for all products");
			} else {
				alert("Please fill HSN numbers for all products");
			}
		}
	};

	const handlePrint = () => {
		const printContent = printRef.current;
		const newWindow = window.open("", "_blank");
		newWindow.document.write(`
        <html>
          <head>
            <style>
              @page { size: A4; margin: 1cm; margin-top: 1cm; margin-bottom: 1cm; }
              @media print {
                button {
                  display: none !important;
                }
              }
              body { 
                font-family: -apple-system, system-ui, sans-serif;
                font-size: 12pt;
                line-height: 1;
                border: 1px solid rgb(20, 20, 21);
                padding: 1rem; 
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 4px 8px;
                font-size: 11pt;
              }
              th {
                background-color: #00bcd4;
                color: white;
                font-weight: normal;
              }
              .text-right { text-align: right; }
              .text-xs { font-size: 10pt; }
              .font-medium { font-weight: 500; }
              .font-bold { font-weight: bold; }
              .mb-8 { margin-bottom: 2rem; }
              .mt-2 { margin-top: 0.5rem; }
              .p-2 { padding: 0.5rem; }
              .grid { display: grid; gap: 1rem; }
              .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
              .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
              .border { border: 1px solid rgb(22, 22, 23); }
              .border-t { border-top: 1px solid #e5e7eb; }
              .border-r { border-right: 1px solid #e5e7eb; }
              .border-x { border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; }
              .border-b { border-bottom: 1px solid #e5e7eb; }
              .bg-cyan-500 { background-color: #00bcd4; }
              .text-white { color: white; }
              .text-cyan-500 { color: #00bcd4; }
              .pb-2 { padding-bottom: 0.5rem; }
              .mt-4 { margin-top: 1rem; }
              .whitespace-pre-line { white-space: pre-line; }


              .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
            .col-span-1 { grid-column: span 1; }
            .border-r { border-right: 1px solid #e5e7eb; }
            .p-4 { padding: 1rem; }
            .p-2 { padding: 0.5rem; }
            .mt-4 { margin-top: 1rem; }
            .mt-16 { margin-top: 4rem; }
            .mt-2 { margin-top: 0.5rem; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .justify-between { justify-content: space-between; }
            .w-32 { width: 8rem; }
            .h-32 { height: 8rem; }
            .h-8 { height: 2rem; }
            .inline-block { display: inline-block; }
            .text-right { text-align: right; }
            .bg-cyan-500 { background-color: #00bcd4; }
            .text-white { color: white; }
            .pt-0 { padding-top: 0; }
            .mt-0 { margin-top: 0; }
            .ml-0 { margin-left: 0; }
            .mr-0 { margin-right: 0; }
            .mb-0 { margin-bottom: 0; }
            .pb-0 { padding-bottom: 0; }
            .pl-0 { padding-left: 0; }
            .pr-0 { padding-right: 0; }

               .border-t.border-dashed { border-top: 1px dashed #000; }
            .mt-8 { margin-top: 2rem; }
            .pt-4 { padding-top: 1rem; }
            .mb-4 { margin-bottom: 1rem; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-lg { font-size: 1.125rem; }
            .font-bold { font-weight: bold; }
            .text-cyan-500 { color: #00bcd4; }
            .max-w-md { max-width: 28rem; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .break-all { word-break: break-all; overflow-wrap: anywhere; }


            </style>
          </head>
          <body>
          <img src="/chiltelLogo.png" style="display: none;" onload="this.style.display='block'" />
          ${printContent.innerHTML}
        </body>
        </html>
      `);
		newWindow.document.close();
		const images = newWindow.document.querySelectorAll("img");
		const promises = Array.from(images).map(
			(img) =>
				new Promise((resolve) => {
					img.onload = resolve;
					img.onerror = resolve; // Resolve even if an image fails to load
				})
		);

		Promise.all(promises).then(() => {
			newWindow.focus();
			newWindow.print();
			newWindow.close();
		});
	};

	// Helper function to convert numbers to words
	const convertNumberToWords = (amount) => {
		const ones = [
			"",
			"One",
			"Two",
			"Three",
			"Four",
			"Five",
			"Six",
			"Seven",
			"Eight",
			"Nine",
		];
		const tens = [
			"",
			"",
			"Twenty",
			"Thirty",
			"Forty",
			"Fifty",
			"Sixty",
			"Seventy",
			"Eighty",
			"Ninety",
		];
		const teens = [
			"Eleven",
			"Twelve",
			"Thirteen",
			"Fourteen",
			"Fifteen",
			"Sixteen",
			"Seventeen",
			"Eighteen",
			"Nineteen",
		];

		const convertBelowThousand = (num) => {
			let result = "";

			if (num > 99) {
				result += ones[Math.floor(num / 100)] + " Hundred ";
				num %= 100;
			}

			if (num > 10 && num < 20) {
				result += teens[num - 11] + " ";
			} else {
				result += tens[Math.floor(num / 10)] + " ";
				result += ones[num % 10] + " ";
			}

			return result.trim();
		};

		if (amount === 0) return "Zero Rupees Only";

		let result = "";
		const crore = Math.floor(amount / 10000000);
		const lakh = Math.floor((amount % 10000000) / 100000);
		const thousand = Math.floor((amount % 100000) / 1000);
		const hundred = Math.floor((amount % 1000) / 100);
		const belowHundred = Math.floor(amount % 100);

		if (crore) result += convertBelowThousand(crore) + " Crore ";
		if (lakh) result += convertBelowThousand(lakh) + " Lakh ";
		if (thousand) result += convertBelowThousand(thousand) + " Thousand ";
		if (hundred) result += ones[hundred] + " Hundred ";
		if (belowHundred) result += "and " + convertBelowThousand(belowHundred);

		// Handle decimal part (fractional part)
		const fractionalPart = Math.round((amount % 1) * 100); // Get two decimal places
		if (fractionalPart > 0) {
			result += " and " + convertBelowThousand(fractionalPart) + " Paise";
		}

		return result.trim() + " Only";
	};

	const orderDetails = {
		invoiceNumber: order._id,
		invoiceDate: new Date().toLocaleDateString(),
		poNumber: order._id,
		poDate: new Date(order.createdAt).toLocaleDateString(),
		transport: {
			name: "Porter",
			vehicleNumber: "WB-05-7799",
			deliveryDate: "20-08-2023",
			deliveryLocation: "RAJABAJAR MORE",
		},
		company: {
			name: "Chiltel India Private Limited",
			address:
				"Shristi Apartment, FLAT NO-1 D/2, NOWBHANGA, SEC-IV, S/L, NORTH 24 PARGANAS, KOLKATA 700105",
			phone: "8017056667",
			email: "Info@Chiltel.Com",
			gstin: "19AAJCC9651K1Z0",
			state: "19-West Bengal",
		},
		customer: {
			name: order.userId.name,
			address: `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipCode}`,
			contact: "9830186398",
			gstin: "19AAJCD0841N1ZB",
			state: order.address.state,
		},
		bank: {
			name: "STATE BANK OF INDIA, GARFA",
			accountNo: "040683332688",
			ifsc: "SBIN0001450",
			accountHolder: "Chiltel India Private Limited",
		},
		items: order.products.map((item, index) => ({
			name: item.product.name,
			model: item.product.model,
			brand: item.product.brand,
			serialNumbers: Array.from({ length: item.quantity }).map(
				(_, i) => serialNumbers[index * item.quantity + i]
			), // Add if available
			hsn: hsnNumbers[index],
			mrp: item.price / (0.9 * 1.18),
			quantity: item.quantity,
			discount: item.product.discount * 100,
			unit: "Nos",
			unitPrice: item.price / 1.18,
			taxableAmount: item.price, // Including 18% GST
			cgst: (item.price / 1.18) * 0.09, // 9% CGST
			sgst: (item.price / 1.18) * 0.09, // 9% SGST
			gst: (item.price / 1.18) * 0.18, // 18% GST
			total: item.price, // Including 18% GST
		})),
		total: {
			subTotal: order.products.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			),
			cgst: order.products.reduce(
				(sum, item) => sum + item.price * item.quantity * 0.09,
				0
			),
			sgst: order.products.reduce(
				(sum, item) => sum + item.price * item.quantity * 0.09,
				0
			),
			gst: order.products.reduce(
				(sum, item) => sum + item.price * item.quantity * 0.18,
				0
			),
			total: order.totalAmount,
		},
	};

	// If chalan is not yet shown, render serial number input
	if (!showChalan) {
		return (
			<Card className="shadow-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						Enter Serial Numbers
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Product Name</TableHead>
								<TableHead>Brand</TableHead>
								<TableHead>Model</TableHead>
								<TableHead>Quantity</TableHead>
								<TableHead>HSN Code</TableHead>
								<TableHead>Serial Numbers</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{order.products.map((item, index) => (
								<TableRow key={index}>
									<TableCell>{item.product.name}</TableCell>
									<TableCell>{item.product.brand || "N/A"}</TableCell>
									<TableCell>{item.product.model || "N/A"}</TableCell>
									<TableCell>{item.quantity}</TableCell>
									<TableCell>
										<Input
											type="text"
											value={hsnNumbers[index]}
											onChange={(e) =>
												handleHsnNumberChange(index, e.target.value)
											}
											placeholder="Enter HSN code"
											className="w-full"
											required
										/>
									</TableCell>
									<TableCell>
										{Array.from({ length: item.quantity }).map((_, i) => (
											<Input
												key={`${index}-${i}`}
												type="text"
												value={serialNumbers[index * item.quantity + i]}
												onChange={(e) =>
													handleSerialNumberChange(
														index * item.quantity + i,
														e.target.value
													)
												}
												placeholder={`Serial # for ${item.product.name}`}
												className="w-full mb-2"
												required
											/>
										))}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
				<CardFooter className="text-center">
					<Button onClick={handleProceed} className="w-full md:w-auto">
						Proceed to Invoice
					</Button>
				</CardFooter>
			</Card>
		);
	}

	return (
		<div className="max-h-[80vh] bg-gray-50 rounded-lg overflow-y-auto">
			<div className="max-w-5xl mx-auto">
				<div
					ref={printRef}
					className="bg-white shadow-lg rounded-lg overflow-hidden text-sm"
				>
					<div className="p-8">
						{/* Header */}
						<div className="relative border-b pb-6 mb-6">
							<h1 className="text-3xl font-bold text-center w-full absolute top-0">
								Tax Invoice
							</h1>
							<div className="flex justify-end">
								<button
									onClick={handlePrint}
									className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
								>
									Print Invoice
								</button>
							</div>
						</div>

						{/* Invoice title and company details */}
						<div className="flex mb-8">
							<div className="w-48">
								<img
									src="/chiltelLogo.png"
									alt="Chiltel Logo"
									className="w-32 p-4"
								/>
							</div>
							<div className="flex">
								<div className="text-right">
									<h2 className="font-bold text-lg">
										{orderDetails.company.name}
									</h2>
									<p className="whitespace-pre-line">
										{orderDetails.company.address}
									</p>
									<p>
										Phone no.: {orderDetails.company.phone} Email:{" "}
										{orderDetails.company.email}
									</p>
									<p>
										GSTIN: {orderDetails.company.gstin}, State:{" "}
										{orderDetails.company.state}
									</p>
								</div>
							</div>
						</div>

						{/* Bill To, Transportation Details, Invoice Details */}
						<div className="grid grid-cols-2 gap-8 mb-8">
							<div className="border">
								<h2 className="font-bold text-lg bg-cyan-500 text-white p-2 mt-0 mb-0">
									Bill To
								</h2>
								<div className="p-4 mt-0 pt-0">
									<p className="font-medium">{orderDetails.customer.name}</p>
									<p className="whitespace-pre-line">
										{orderDetails.customer.address}
									</p>
									<p>Contact No.: {orderDetails.customer.contact}</p>
									<p>State: {orderDetails.customer.state}</p>
									<p>Place of supply: {orderDetails.customer.state}</p>
								</div>
							</div>
							<div className="text-right border p-4">
								<p className="mb-2">
									Invoice No.: {orderDetails.invoiceNumber}
								</p>
								<p className="mb-2">Date: {orderDetails.invoiceDate}</p>
								<p className="mb-2">PO Number: {orderDetails.poNumber}</p>
								<p>PO Date: {orderDetails.poDate}</p>
							</div>
						</div>

						<div
							className="mb-8 flex justify-center items-start flex-col content-around break-all"
							style={{ font: "0.5rem" }}
						>
							<table className="w-full border-collapse border border-gray-300">
								<thead>
									<tr className="bg-cyan-500 text-white">
										<th className="border px-2 py-1 text-left">#</th>
										<th className="border px-2 py-1 text-left">Item name</th>
										<th className="border px-2 py-1 text-left">Brand/Model</th>
										<th className="border px-2 py-1 text-left">HSN/SAC</th>
										<th className="border px-2 py-1 text-right">MRP</th>
										<th className="border px-2 py-1 text-right">Quantity</th>
										<th className="border px-2 py-1 text-right">Discount</th>
										<th className="border px-2 py-1 text-right">Price/Unit</th>
										<th className="border px-2 py-1 text-right">Gst</th>
										<th className="border px-2 py-1 text-right">
											Total Amount
										</th>
									</tr>
								</thead>
								<tbody>
									{orderDetails.items.map((item, index) => (
										<tr key={index}>
											<td className="border px-2 py-1">{index + 1}</td>
											<td className="border px-2 py-1">
												{item.name}
												<div className="text-xs">
													Serial No.: {item.serialNumbers.join(", ")}
												</div>
											</td>
											<td className="border px-2 py-1">
												<div>{item.brand}</div>
												<div>{item.model}</div>
											</td>
											<td className="border px-2 py-1">{item.hsn}</td>
											<td className="border px-2 py-1 text-right">
												₹{item.mrp.toLocaleString()}
											</td>
											<td className="border px-2 py-1 text-right">
												{item.quantity}
											</td>
											<td className="border px-2 py-1 text-right">
												{item.discount.toLocaleString()}%
											</td>
											<td className="border px-2 py-1 text-right">
												₹{item.unitPrice.toFixed(2)}
											</td>
											<td className="border px-2 py-1 text-right">
												₹{item.gst.toFixed(2)}
											</td>
											<td className="border px-2 py-1 text-right">
												₹{(item.total * item.quantity).toFixed(2)}
											</td>
										</tr>
									))}
									<tr>
										<td
											colSpan="9"
											className="border px-2 py-1 text-right font-bold"
										>
											Total
										</td>
										<td className="border px-2 py-1 text-right font-bold">
											₹{orderDetails.total.subTotal.toLocaleString()}
										</td>
									</tr>
								</tbody>
							</table>

							{/* Tax details and Amounts */}
							<div className="grid grid-cols-2 border-t border-gray-200 mt-2">
								<div className="border-r p-2">
									<table className="w-full">
										<tbody>
											<tr>
												<td className="font-bold">Tax details</td>
												<td className="text-right">9%</td>
											</tr>
											<tr>
												<td>CGST</td>
												<td className="text-right">
													₹{orderDetails.total.cgst.toFixed(2)}
												</td>
											</tr>
											<tr>
												<td>SGST</td>
												<td className="text-right">
													₹{orderDetails.total.sgst.toFixed(2)}
												</td>
											</tr>
										</tbody>
									</table>
									{/* Amount in Words and Payment Mode */}
									<div className="mt-4">
										<div className="bg-cyan-500 text-white p-2 font-medium">
											Invoice Amount In Words
										</div>
										<div className="p-2 border-x border-b">
											{convertNumberToWords(
												orderDetails.total.subTotal + orderDetails.total.gst
											)}
										</div>
										<div className="bg-cyan-500 text-white p-2 font-medium mt-2">
											Payment mode
										</div>
										<div className="p-2 border-x border-b">
											{order.paymentDetails.method}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Footer Section */}
						<div className="grid grid-cols-2 border-t border-gray-200">
							{/* Terms & Bank Details */}
							<div className="col-span-1 border-r">
								<div className="bg-cyan-500 text-white p-2">
									Terms and Conditions
								</div>
								<p className="">100% Advance Payment with PO.</p>
								<p className="">Thanks for doing business with us!</p>

								<div className="bg-cyan-500 text-white p-2 mt-4">
									Bank details:
								</div>
								<div className="">
									<p>Bank Name: {orderDetails.bank.name}</p>
									<p>Bank Account No.: {orderDetails.bank.accountNo}</p>
									<p>Bank IFSC code: {orderDetails.bank.ifsc}</p>
									<p>
										Account holder's name: {orderDetails.bank.accountHolder}
									</p>
								</div>
							</div>

							{/* Signature */}
							<div className="p-4 flex flex-col justify-between">
								<div className="text-right">
									<p>For, {orderDetails.company.name}</p>
									<div className="mt-16">
										<img
											src="/chiltelSignature.png"
											alt="Signature"
											className="inline-block"
										/>
										<p>Authorized Signatory</p>
									</div>
								</div>
							</div>
						</div>

						{/* Acknowledgement Section */}
						<div className="border-t border-dashed pt-4">
							<div className="text-center font-bold mb-4">ACKNOWLEDGEMENT</div>
							<div className="text-center text-lg text-cyan-500 font-bold mb-4">
								CHILTEL INDIA PRIVATE LIMITED
							</div>

							<div className="grid grid-cols-2">
								<div>
									<div className="font-bold">{orderDetails.customer.name}</div>
									<div className="max-w-md">
										{orderDetails.customer.address}
									</div>
									<div className="mt-8">Receiver's Seal & Sign</div>
								</div>
								<div className="text-right">
									<div>INVOICE NO. : {orderDetails.invoiceNumber}</div>
									<div>INVOICE DATE : {orderDetails.invoiceDate}</div>
									<div className="font-bold">
										INVOICE AMOUNT : ₹
										{orderDetails.total.subTotal + orderDetails.total.gst}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 text-center">
					<button
						onClick={() => setShowChalan(false)}
						className="mr-4 bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors"
					>
						Edit Serial Numbers
					</button>
					<button
						onClick={handlePrint}
						className="bg-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
					>
						Print Invoice
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductOrderChalan;
