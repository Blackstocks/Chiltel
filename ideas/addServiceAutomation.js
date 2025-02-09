const handleAddService = async (product) => {
	try {
		const response = await fetch(`http://localhost:4000/api/services`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token:
					"eyJhbGciOiJIUzI1NiJ9.YWRtaW5AZXhhbXBsZS5jb21ncmVhdHN0YWNrMTIz.4OrQphsHNe6B8_uPr78EUPXtWPxJ9jQoP8nsPD9TgNA",
			},
			body: JSON.stringify(product),
		});

		const data = await response.json();

		if (response.ok) {
			console.log("Product added successfully!");
		} else {
			console.log(product);
			console.error(data.message || "Failed to add product");
		}
	} catch (error) {
		console.error("Error:", error);
	}
};

const services = [
	// Air Cooler Services
	{
		name: "Air Cooler Deep Clean Service",
		description:
			"Complete cleaning of cooling pads, water tank, and all components",
		price: 799,
		discount: 0.1,
		product: "Air Cooler",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Water connection", "Power supply", "Working space"],
	},
	{
		name: "Air Cooler Regular Maintenance",
		description:
			"Basic maintenance including pad cleaning and water quality check",
		price: 499,
		discount: 0.1,
		product: "Air Cooler",
		category: "Service",
		estimatedDuration: "1 hour",
		isAvailable: true,
		requirements: ["Power supply", "Water connection"],
	},
	{
		name: "Air Cooler Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Air Cooler",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Air Cooler Motor Repair",
		description: "Complete motor repair or replacement",
		price: 899,
		discount: 0.1,
		product: "Air Cooler",
		category: "Repair",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Air Cooler Pump Repair",
		description: "Water pump repair or replacement",
		price: 699,
		discount: 0.1,
		product: "Air Cooler",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply", "Water connection"],
	},

	// Air Purifier Services
	{
		name: "Air Purifier Deep Clean Service",
		description: "Complete cleaning of all filters and internal components",
		price: 699,
		discount: 0.08,
		product: "Air Purifier",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Air Purifier Filter Service",
		description: "Filter cleaning and sanitization",
		price: 399,
		discount: 0.08,
		product: "Air Purifier",
		category: "Service",
		estimatedDuration: "45 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Air Purifier Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Air Purifier",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Air Purifier Motor Repair",
		description: "Fan motor repair or replacement",
		price: 799,
		discount: 0.1,
		product: "Air Purifier",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Air Purifier Circuit Repair",
		description: "Electronic circuit and sensor repair",
		price: 999,
		discount: 0.1,
		product: "Air Purifier",
		category: "Repair",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},

	// Cassette AC Services
	{
		name: "Cassette AC Installation",
		description: "Professional installation with ducting and drainage setup",
		price: 4500,
		discount: 0.1,
		product: "Cassette AC",
		category: "Installation",
		estimatedDuration: "4-5 hours",
		isAvailable: true,
		requirements: [
			"False ceiling",
			"Drainage facility",
			"Electrical wiring",
			"Outdoor unit space",
		],
	},
	{
		name: "Cassette AC Deep Clean Service",
		description: "Complete cleaning of indoor unit, drain pan, and filters",
		price: 1499,
		discount: 0.15,
		product: "Cassette AC",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Access to indoor unit"],
	},
	{
		name: "Cassette AC Gas Charging",
		description: "Refrigerant gas charging and leak detection",
		price: 2499,
		discount: 0.1,
		product: "Cassette AC",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Access to both units"],
	},
	{
		name: "Cassette AC Regular Maintenance",
		description: "Basic service including cleaning and performance check",
		price: 999,
		discount: 0.15,
		product: "Cassette AC",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply", "Access to indoor unit"],
	},
	{
		name: "Cassette AC Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Cassette AC",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Cassette AC Compressor Repair",
		description: "Compressor repair or replacement",
		price: 3499,
		discount: 0.1,
		product: "Cassette AC",
		category: "Repair",
		estimatedDuration: "4-5 hours",
		isAvailable: true,
		requirements: ["Power supply", "Access to both units"],
	},
	{
		name: "Cassette AC PCB Repair",
		description: "Control board repair or replacement",
		price: 2499,
		discount: 0.1,
		product: "Cassette AC",
		category: "Repair",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Access to indoor unit"],
	},

	// Deep Freezer Services
	{
		name: "Deep Freezer Deep Clean Service",
		description: "Complete cleaning and sanitization of freezer",
		price: 1499,
		discount: 0.12,
		product: "Deep Freezer",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Access space"],
	},
	{
		name: "Deep Freezer Gas Charging",
		description: "Refrigerant gas charging and leak detection",
		price: 2499,
		discount: 0.1,
		product: "Deep Freezer",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Deep Freezer Regular Maintenance",
		description: "Basic service including temperature calibration",
		price: 999,
		discount: 0.12,
		product: "Deep Freezer",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Deep Freezer Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Deep Freezer",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Deep Freezer Compressor Repair",
		description: "Compressor repair or replacement",
		price: 3499,
		discount: 0.1,
		product: "Deep Freezer",
		category: "Repair",
		estimatedDuration: "4-5 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Deep Freezer Thermostat Repair",
		description: "Thermostat replacement and calibration",
		price: 1299,
		discount: 0.1,
		product: "Deep Freezer",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},

	// Display Counter Services
	{
		name: "Display Counter Deep Clean",
		description: "Complete cleaning and sanitization",
		price: 1799,
		discount: 0.1,
		product: "Display Counter",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Access space"],
	},
	{
		name: "Display Counter Regular Maintenance",
		description: "Basic maintenance and temperature check",
		price: 999,
		discount: 0.1,
		product: "Display Counter",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Display Counter Gas Charging",
		description: "Refrigerant gas charging and leak detection",
		price: 2499,
		discount: 0.1,
		product: "Display Counter",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Display Counter Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Display Counter",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Display Counter Compressor Repair",
		description: "Compressor repair or replacement",
		price: 3299,
		discount: 0.1,
		product: "Display Counter",
		category: "Repair",
		estimatedDuration: "4-5 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Display Counter Light Repair",
		description: "Display lighting system repair",
		price: 999,
		discount: 0.1,
		product: "Display Counter",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},

	// Geyser Services
	{
		name: "Geyser Installation",
		description: "Professional installation with safety features",
		price: 1299,
		discount: 0.12,
		product: "Geyser",
		category: "Installation",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Water connection", "Power point", "Mounting space"],
	},
	{
		name: "Geyser Deep Clean Service",
		description: "Complete descaling and tank cleaning",
		price: 899,
		discount: 0.1,
		product: "Geyser",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Water connection", "Power supply"],
	},
	{
		name: "Geyser Regular Maintenance",
		description: "Basic service including safety valve check",
		price: 599,
		discount: 0.1,
		product: "Geyser",
		category: "Service",
		estimatedDuration: "1 hour",
		isAvailable: true,
		requirements: ["Water connection", "Power supply"],
	},
	{
		name: "Geyser Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Geyser",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Geyser Element Repair",
		description: "Heating element replacement",
		price: 1299,
		discount: 0.1,
		product: "Geyser",
		category: "Repair",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Water connection", "Power supply"],
	},
	{
		name: "Geyser Thermostat Repair",
		description: "Thermostat replacement and calibration",
		price: 899,
		discount: 0.1,
		product: "Geyser",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},

	// Microwave Services
	{
		name: "Microwave Deep Clean Service",
		description: "Complete cleaning and cavity sanitization",
		price: 699,
		discount: 0.08,
		product: "Microwave",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Microwave Regular Maintenance",
		description: "Basic service including safety check",
		price: 499,
		discount: 0.08,
		product: "Microwave",
		category: "Service",
		estimatedDuration: "1 hour",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Microwave Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Microwave",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Microwave Magnetron Repair",
		description: "Magnetron replacement and testing",
		price: 1499,
		discount: 0.1,
		product: "Microwave",
		category: "Repair",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Microwave Control Panel Repair",
		description: "Control panel or display repair",
		price: 999,
		discount: 0.1,
		product: "Microwave",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},

	// Refrigerator Services
	{
		name: "Refrigerator Deep Clean Service",
		description: "Complete cleaning including coils and drip tray",
		price: 999,
		discount: 0.1,
		product: "Refrigerator",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Access space"],
	},
	{
		name: "Refrigerator Regular Maintenance",
		description: "Basic service including temperature check",
		price: 699,
		discount: 0.1,
		product: "Refrigerator",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Refrigerator Gas Charging",
		description: "Refrigerant gas charging and leak detection",
		price: 1999,
		discount: 0.1,
		product: "Refrigerator",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Refrigerator Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Refrigerator",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Refrigerator Compressor Repair",
		description: "Compressor repair or replacement",
		price: 3499,
		discount: 0.1,
		product: "Refrigerator",
		category: "Repair",
		estimatedDuration: "4-5 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Refrigerator Thermostat Repair",
		description: "Thermostat replacement and calibration",
		price: 1299,
		discount: 0.1,
		product: "Refrigerator",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},

	// Visi Cooler Services
	{
		name: "Visi Cooler Deep Clean",
		description: "Complete cleaning and sanitization",
		price: 1599,
		discount: 0.12,
		product: "Visi Cooler",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Access space"],
	},
	{
		name: "Visi Cooler Regular Maintenance",
		description: "Basic service including temperature check",
		price: 999,
		discount: 0.12,
		product: "Visi Cooler",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Visi Cooler Gas Charging",
		description: "Refrigerant gas charging and leak detection",
		price: 2499,
		discount: 0.1,
		product: "Visi Cooler",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Visi Cooler Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Visi Cooler",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Visi Cooler Compressor Repair",
		description: "Compressor repair or replacement",
		price: 3299,
		discount: 0.1,
		product: "Visi Cooler",
		category: "Repair",
		estimatedDuration: "4-5 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Visi Cooler Light Repair",
		description: "Display lighting system repair",
		price: 999,
		discount: 0.1,
		product: "Visi Cooler",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},

	// Washing Machine Services
	{
		name: "Washing Machine Deep Clean",
		description: "Complete cleaning including drum and filter",
		price: 899,
		discount: 0.1,
		product: "Washing Machine",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Water connection", "Power supply"],
	},
	{
		name: "Washing Machine Regular Maintenance",
		description: "Basic service including performance check",
		price: 599,
		discount: 0.1,
		product: "Washing Machine",
		category: "Service",
		estimatedDuration: "1 hour",
		isAvailable: true,
		requirements: ["Water connection", "Power supply"],
	},
	{
		name: "Washing Machine Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Washing Machine",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Washing Machine Motor Repair",
		description: "Motor repair or replacement",
		price: 1899,
		discount: 0.1,
		product: "Washing Machine",
		category: "Repair",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Washing Machine PCB Repair",
		description: "Control board repair or replacement",
		price: 1499,
		discount: 0.1,
		product: "Washing Machine",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},

	// Water Cooler cum Purifier Services
	{
		name: "Water Cooler cum Purifier Deep Clean",
		description:
			"Complete cleaning and sanitization of cooling and purification systems",
		price: 1299,
		discount: 0.15,
		product: "Water Cooler cum Purifier",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Water connection", "Power supply"],
	},
	{
		name: "Water Cooler cum Purifier Filter Change",
		description: "Complete filter replacement service",
		price: 999,
		discount: 0.1,
		product: "Water Cooler cum Purifier",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Water connection"],
	},
	{
		name: "Water Cooler cum Purifier Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Water Cooler cum Purifier",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Water Cooler cum Purifier Compressor Repair",
		description: "Cooling system repair",
		price: 1899,
		discount: 0.1,
		product: "Water Cooler cum Purifier",
		category: "Repair",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Water Cooler cum Purifier UV Repair",
		description: "UV system repair or replacement",
		price: 1299,
		discount: 0.1,
		product: "Water Cooler cum Purifier",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	// Water Dispenser Services
	{
		name: "Water Dispenser Deep Clean",
		description: "Complete cleaning and sanitization of dispensing system",
		price: 799,
		discount: 0.08,
		product: "Water Dispenser",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Water connection", "Power supply"],
	},
	{
		name: "Water Dispenser Filter Change",
		description: "Filter replacement and system sanitization",
		price: 599,
		discount: 0.1,
		product: "Water Dispenser",
		category: "Service",
		estimatedDuration: "1 hour",
		isAvailable: true,
		requirements: ["Water connection"],
	},
	{
		name: "Water Dispenser Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Water Dispenser",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Water Dispenser Cooling Repair",
		description: "Cooling system repair or replacement",
		price: 1299,
		discount: 0.1,
		product: "Water Dispenser",
		category: "Repair",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Water Dispenser Tap Repair",
		description: "Dispensing tap repair or replacement",
		price: 699,
		discount: 0.1,
		product: "Water Dispenser",
		category: "Repair",
		estimatedDuration: "1 hour",
		isAvailable: true,
		requirements: ["Water connection"],
	},

	// Back Bar Chiller Services
	{
		name: "Back Bar Chiller Deep Clean",
		description: "Complete cleaning and sanitization",
		price: 1799,
		discount: 0.12,
		product: "Back Bar Chiller",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Access space"],
	},
	{
		name: "Back Bar Chiller Regular Maintenance",
		description: "Basic service including temperature check",
		price: 999,
		discount: 0.1,
		product: "Back Bar Chiller",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Back Bar Chiller Gas Charging",
		description: "Refrigerant gas charging and leak detection",
		price: 2499,
		discount: 0.1,
		product: "Back Bar Chiller",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Back Bar Chiller Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Back Bar Chiller",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Back Bar Chiller Compressor Repair",
		description: "Compressor repair or replacement",
		price: 3299,
		discount: 0.1,
		product: "Back Bar Chiller",
		category: "Repair",
		estimatedDuration: "4-5 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Back Bar Chiller Light Repair",
		description: "Display lighting system repair",
		price: 999,
		discount: 0.1,
		product: "Back Bar Chiller",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},

	// Under Counter Services
	{
		name: "Under Counter Deep Clean",
		description: "Complete cleaning and sanitization",
		price: 1599,
		discount: 0.1,
		product: "Under Counter",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Access space"],
	},
	{
		name: "Under Counter Regular Maintenance",
		description: "Basic service including temperature check",
		price: 899,
		discount: 0.1,
		product: "Under Counter",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Under Counter Gas Charging",
		description: "Refrigerant gas charging and leak detection",
		price: 2299,
		discount: 0.1,
		product: "Under Counter",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Under Counter Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Under Counter",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Under Counter Compressor Repair",
		description: "Compressor repair or replacement",
		price: 2999,
		discount: 0.1,
		product: "Under Counter",
		category: "Repair",
		estimatedDuration: "4-5 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Under Counter Door Repair",
		description: "Door system and seal repair",
		price: 899,
		discount: 0.1,
		product: "Under Counter",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},

	// Ice Maker Services
	{
		name: "Ice Maker Deep Clean",
		description: "Complete cleaning and sanitization",
		price: 2299,
		discount: 0.15,
		product: "Ice Maker",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Water connection", "Power supply", "Drainage"],
	},
	{
		name: "Ice Maker Regular Maintenance",
		description: "Basic service including production check",
		price: 1499,
		discount: 0.1,
		product: "Ice Maker",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Water connection", "Power supply"],
	},
	{
		name: "Ice Maker Scale Removal",
		description: "Descaling and mineral deposit removal",
		price: 1799,
		discount: 0.1,
		product: "Ice Maker",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Water connection", "Power supply"],
	},
	{
		name: "Ice Maker Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Ice Maker",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Ice Maker Compressor Repair",
		description: "Compressor repair or replacement",
		price: 3499,
		discount: 0.15,
		product: "Ice Maker",
		category: "Repair",
		estimatedDuration: "4-5 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Ice Maker Water System Repair",
		description: "Water circulation system repair",
		price: 1699,
		discount: 0.1,
		product: "Ice Maker",
		category: "Repair",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Water connection", "Power supply"],
	},

	// Food Prep Chiller Services
	{
		name: "Food Prep Chiller Deep Clean",
		description: "Complete cleaning and sanitization",
		price: 1899,
		discount: 0.12,
		product: "Food Prep Chiller",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Access space"],
	},
	{
		name: "Food Prep Chiller Regular Maintenance",
		description: "Basic service including temperature check",
		price: 1099,
		discount: 0.1,
		product: "Food Prep Chiller",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Food Prep Chiller Gas Charging",
		description: "Refrigerant gas charging and leak detection",
		price: 2599,
		discount: 0.1,
		product: "Food Prep Chiller",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Food Prep Chiller Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Food Prep Chiller",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Food Prep Chiller Compressor Repair",
		description: "Compressor repair or replacement",
		price: 3199,
		discount: 0.12,
		product: "Food Prep Chiller",
		category: "Repair",
		estimatedDuration: "4-5 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Food Prep Chiller Container Repair",
		description: "Food container and lid repair",
		price: 999,
		discount: 0.1,
		product: "Food Prep Chiller",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},

	// Upright Chiller Services
	{
		name: "Upright Chiller Deep Clean",
		description: "Complete cleaning and sanitization",
		price: 1999,
		discount: 0.1,
		product: "Upright Chiller",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Access space"],
	},
	{
		name: "Upright Chiller Regular Maintenance",
		description: "Basic service including temperature check",
		price: 1199,
		discount: 0.1,
		product: "Upright Chiller",
		category: "Service",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Upright Chiller Gas Charging",
		description: "Refrigerant gas charging and leak detection",
		price: 2699,
		discount: 0.1,
		product: "Upright Chiller",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Upright Chiller Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Upright Chiller",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Upright Chiller Compressor Repair",
		description: "Compressor repair or replacement",
		price: 3299,
		discount: 0.1,
		product: "Upright Chiller",
		category: "Repair",
		estimatedDuration: "4-5 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Upright Chiller Door Repair",
		description: "Door system and seal repair",
		price: 1099,
		discount: 0.1,
		product: "Upright Chiller",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Power supply"],
	},

	// Water Cooler Services
	{
		name: "Water Cooler Deep Clean",
		description: "Complete cleaning and sanitization",
		price: 899,
		discount: 0.1,
		product: "Water Cooler",
		category: "Service",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Water connection", "Power supply"],
	},
	{
		name: "Water Cooler Regular Maintenance",
		description: "Basic service including temperature check",
		price: 599,
		discount: 0.1,
		product: "Water Cooler",
		category: "Service",
		estimatedDuration: "1 hour",
		isAvailable: true,
		requirements: ["Water connection", "Power supply"],
	},
	{
		name: "Water Cooler Attending Charges",
		description: "Diagnosis and minor repairs",
		price: 499,
		discount: 0,
		product: "Water Cooler",
		category: "Repair",
		estimatedDuration: "30-60 minutes",
		isAvailable: true,
		requirements: ["Power supply"],
	},
	{
		name: "Water Cooler Compressor Repair",
		description: "Cooling system repair or replacement",
		price: 1499,
		discount: 0.1,
		product: "Water Cooler",
		category: "Repair",
		estimatedDuration: "2-3 hours",
		isAvailable: true,
		requirements: ["Power supply", "Working space"],
	},
	{
		name: "Water Cooler Tank Repair",
		description: "Water tank and pipe repair",
		price: 799,
		discount: 0.1,
		product: "Water Cooler",
		category: "Repair",
		estimatedDuration: "1-2 hours",
		isAvailable: true,
		requirements: ["Water connection"],
	},
];

// Continuing with more products...
console.log("Adding services...");
console.log(services.length);
services.forEach((service) => {
	handleAddService(service);
});

// Usage example:
