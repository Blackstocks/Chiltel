import { productsData } from "../frontend/src/data/products.js";

const handleAddProduct = async (product) => {
	try {
		const response = await fetch(`http://localhost:4000/api/product/add`, {
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

console.log("Adding products...");

// Object.values(productsData).forEach((product) => {
// 	product.forEach((product) => {
// 		product = {
// 			...product,
// 			model: product.specifications.model,
// 			price: product.originalPrice,
// 			discount:
// 				(product.originalPrice - product.discountedPrice) /
// 				product.originalPrice,
// 			thumbnail: product.image,
// 			imageUrls: [product.image],
// 			inStock: 10,
// 		};
// 		// handleAddProduct(product);
// 	});
// });

/**
 * Transform raw product data to match Mongoose schema
 */
const transformProducts = (productsData) => {
	const transformedProducts = [];

	// Helper function to determine mainCategory and type
	const getCategoryInfo = (categoryKey) => {
		const categoryMap = {
			"air-conditioner": {
				mainCategory: "Domestic Appliance",
				type: "cooling",
			},
			geyser: { mainCategory: "Domestic Appliance", type: "heating" },
			refrigerator: { mainCategory: "Domestic Appliance", type: "cooling" },
			"air-cooler": { mainCategory: "Domestic Appliance", type: "cooling" },
			"air-purifier": { mainCategory: "Domestic Appliance", type: "cleaning" },
			microwave: { mainCategory: "Kitchen", type: "cooking" },
			"cassette-ac": { mainCategory: "Domestic Appliance", type: "cooling" },
			"deep-freezer": { mainCategory: "Retail", type: "cooling" },
			"visi-cooler": { mainCategory: "Retail", type: "display" },
			"water-dispenser": { mainCategory: "Domestic Appliance", type: "water" },
			"water-cooler-cum-purifier": {
				mainCategory: "Domestic Appliance",
				type: "water",
			},
			"ice-maker": { mainCategory: "Kitchen", type: "cooling" },
			"food-prep-chiller": { mainCategory: "Kitchen", type: "cooling" },
			"upright-chiller": { mainCategory: "Kitchen", type: "cooling" },
			"back-bar-chiller": { mainCategory: "Kitchen", type: "cooling" },
		};

		return (
			categoryMap[categoryKey] || {
				mainCategory: "Domestic Appliance",
				type: "cooling",
			}
		);
	};
	// Process each category
	Object.entries(productsData).forEach(([categoryKey, products]) => {
		const { mainCategory, type } = getCategoryInfo(categoryKey);

		products.forEach((product) => {
			// Convert prices to numbers and calculate discount
			const originalPrice = parseFloat(product.originalPrice);
			const discountedPrice = parseFloat(product.discountedPrice);
			const discountValue =
				originalPrice === 0
					? 0
					: Math.min(
							Math.max((originalPrice - discountedPrice) / originalPrice, 0),
							1
					  );

			const transformedProduct = {
				name: product.name,
				brand: product.specifications.brand || product.brand,
				model: product.specifications.model || "Not Available",
				mainCategory: mainCategory,
				type: type,
				category: categoryKey
					.split("-")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" "),
				price: parseFloat(originalPrice.toFixed(2)) || 1.0,
				discount: parseFloat(discountValue.toFixed(2)) || 0.0,
				rating: parseFloat(Math.min(Math.max(product.rating, 0), 5).toFixed(2)),
				reviews: parseInt(product.reviews, 10),
				features: Array.isArray(product.features) ? product.features : [],
				specifications: product.specifications,
				inStock: 10, // Default value as specified
				availability: true,
				thumbnail: product.image,
				imageUrls: [product.image],
			};

			transformedProducts.push(transformedProduct);
		});
	});

	return transformedProducts;
};

const data = {
	"display-counter": [
		{
			id: 1,
			name: "Display Counter PTW06",
			image: "https://westernequipments.com/wp-content/uploads/2023/05/s3.jpg",
			originalPrice: "42990",
			discountedPrice: "39990",
			brand: "Western",
			rating: 4.3,
			reviews: 45,
			specifications: {
				brand: "Western",
				model: "PTW06",
				type: "Display Counter",
				length: "6 feet",
				temperature: "2°C to 8°C",
				capacity: "200L",
			},
			features: [
				"Digital Temperature Controller",
				"LED Lighting",
				"Toughened Glass",
				"Adjustable Shelves",
				"Auto Defrost",
				"Energy Efficient",
			],
		},
		{
			id: 2,
			name: "Display Counter PTW15 SBX",
			image: "https://westernequipments.com/wp-content/uploads/2023/05/s5.jpg",
			originalPrice: "62990",
			discountedPrice: "58990",
			brand: "Western",
			rating: 4.4,
			reviews: 52,
			specifications: {
				brand: "Western",
				model: "PTW15 SBX",
				type: "Display Counter",
				length: "15 feet",
				temperature: "2°C to 8°C",
				capacity: "500L",
			},
			features: [
				"Curved Glass Design",
				"Enhanced Visibility",
				"Digital Control Panel",
				"Multiple Shelves",
				"Forced Air Cooling",
				"Night Cover",
			],
		},
		{
			id: 3,
			name: "Display Counter PTW12",
			image: "https://westernequipments.com/wp-content/uploads/2023/05/s4.jpg",
			originalPrice: "54990",
			discountedPrice: "51990",
			brand: "Western",
			rating: 4.5,
			reviews: 38,
			specifications: {
				brand: "Western",
				model: "PTW12",
				type: "Display Counter",
				length: "12 feet",
				temperature: "2°C to 8°C",
				capacity: "400L",
			},
			features: [
				"Premium Build Quality",
				"Efficient Cooling System",
				"LED Display",
				"Adjustable Shelving",
				"Temperature Control",
				"Easy Maintenance",
			],
		},
		{
			id: 4,
			name: "Display Counter PTW15",
			image: "https://westernequipments.com/wp-content/uploads/2023/05/s6.jpg",
			originalPrice: "59990",
			discountedPrice: "56990",
			brand: "Western",
			rating: 4.3,
			reviews: 42,
			specifications: {
				brand: "Western",
				model: "PTW15",
				type: "Display Counter",
				length: "15 feet",
				temperature: "2°C to 8°C",
				capacity: "500L",
			},
			features: [
				"Large Display Area",
				"Uniform Cooling",
				"Digital Controls",
				"Durable Construction",
				"Energy Efficient",
				"Easy Clean Design",
			],
		},
		{
			id: 5,
			name: "Display Counter PTW09",
			image: "https://westernequipments.com/wp-content/uploads/2023/05/s2.jpg",
			originalPrice: "48990",
			discountedPrice: "45990",
			brand: "Western",
			rating: 4.2,
			reviews: 35,
			specifications: {
				brand: "Western",
				model: "PTW09",
				type: "Display Counter",
				length: "9 feet",
				temperature: "2°C to 8°C",
				capacity: "300L",
			},
			features: [
				"Medium Size Display",
				"Temperature Control",
				"LED Lighting",
				"Adjustable Shelves",
				"Auto Defrost",
				"Energy Saving Mode",
			],
		},
	],
	geyser: [
		{
			id: 1,
			name: "Racold Alpha Pro Solar Water Heater",
			image:
				"https://www.racold.com/sites/default/files/2023-03/Alphapro%201.png",
			originalPrice: "32990",
			discountedPrice: "29990",
			brand: "Racold",
			rating: 4.4,
			reviews: 156,
			specifications: {
				brand: "Racold",
				model: "Alpha Pro",
				type: "ETC Solar Water Heater",
				capacity: "100 LPD",
				tubeType: "Evacuated Tubes",
				backup: "Electric Backup",
			},
			features: [
				"High Efficiency Evacuated Tubes",
				"Anti-Freeze Technology",
				"Electric Backup Support",
				"Blue Selective Coating",
				"UV Resistant Coating",
				"5 Years Warranty",
			],
		},
		{
			id: 2,
			name: "Racold Alpha Plus Solar Water Heater",
			image:
				"https://www.racold.com/sites/default/files/2023-03/Alpha%20plus%201.png",
			originalPrice: "28990",
			discountedPrice: "26990",
			brand: "Racold",
			rating: 4.3,
			reviews: 142,
			specifications: {
				brand: "Racold",
				model: "Alpha Plus",
				type: "ETC Solar Water Heater",
				capacity: "150 LPD",
				tubeType: "Evacuated Tubes",
				backup: "Optional Electric",
			},
			features: [
				"Advanced Evacuated Tubes",
				"Double Layer Insulation",
				"Corrosion Resistant Tank",
				"Lightweight Design",
				"Easy Installation",
				"5 Years Warranty",
			],
		},
		{
			id: 3,
			name: "Racold Omega Max 8 Solar Water Heater",
			image:
				"https://www.racold.com/sites/default/files/2023-03/omega%20max%201_0.png",
			originalPrice: "35990",
			discountedPrice: "32990",
			brand: "Racold",
			rating: 4.5,
			reviews: 178,
			specifications: {
				brand: "Racold",
				model: "Omega Max 8",
				type: "FPC Solar Water Heater",
				capacity: "200 LPD",
				tubeType: "Flat Plate Collector",
				backup: "Electric Backup",
			},
			features: [
				"Flat Plate Collector Technology",
				"High Pressure Resistance",
				"Advanced Insulation",
				"Integrated Electric Backup",
				"Weather Resistant Design",
				"7 Years Warranty",
			],
		},
		{
			id: 4,
			name: "Racold Omega Max 8 Premium",
			image:
				"https://www.racold.com/sites/default/files/2023-03/omega%20max%201_0.png",
			originalPrice: "38990",
			discountedPrice: "35990",
			brand: "Racold",
			rating: 4.6,
			reviews: 165,
			specifications: {
				brand: "Racold",
				model: "Omega Max 8 Premium",
				type: "FPC Solar Water Heater",
				capacity: "300 LPD",
				tubeType: "Flat Plate Collector",
				backup: "Electric Backup",
			},
			features: [
				"Premium Flat Plate Collector",
				"High Density Insulation",
				"Smart Temperature Control",
				"Hard Water Compatible",
				"Pressure Pump Compatible",
				"7 Years Warranty",
			],
		},
		{
			id: 5,
			name: "Racold Domestic Heat Pump 150L",
			image:
				"https://www.racold.com/sites/default/files/2023-03/SWH-Domestic-new-1.png",
			originalPrice: "89990",
			discountedPrice: "84990",
			brand: "Racold",
			rating: 4.5,
			reviews: 89,
			specifications: {
				brand: "Racold",
				model: "Domestic-150",
				type: "Heat Pump Water Heater",
				capacity: "150L",
				powerInput: "500W",
				heatingTime: "3-4 hours",
			},
			features: [
				"Energy Efficient Heat Pump Technology",
				"Smart Control Panel",
				"Auto Restart Function",
				"Anti-Legionella Function",
				"Tank Protection",
				"5 Years Tank Warranty",
			],
		},
		{
			id: 6,
			name: "Racold Domestic Heat Pump 200L",
			image:
				"https://www.racold.com/sites/default/files/2023-03/SWH-Domestic-new-1.png",
			originalPrice: "99990",
			discountedPrice: "94990",
			brand: "Racold",
			rating: 4.6,
			reviews: 76,
			specifications: {
				brand: "Racold",
				model: "Domestic-200",
				type: "Heat Pump Water Heater",
				capacity: "200L",
				powerInput: "650W",
				heatingTime: "4-5 hours",
			},
			features: [
				"High Efficiency Heat Pump",
				"Digital Temperature Display",
				"Multiple Protection Systems",
				"Energy Saving Mode",
				"Magnesium Anode Protection",
				"5 Years Tank Warranty",
			],
		},
		{
			id: 7,
			name: "Racold Domestic Heat Pump 300L",
			image:
				"https://www.racold.com/sites/default/files/2023-03/SWH-Domestic-new-1.png",
			originalPrice: "129990",
			discountedPrice: "124990",
			brand: "Racold",
			rating: 4.7,
			reviews: 64,
			specifications: {
				brand: "Racold",
				model: "Domestic-300",
				type: "Heat Pump Water Heater",
				capacity: "300L",
				powerInput: "850W",
				heatingTime: "5-6 hours",
			},
			features: [
				"Advanced Heat Pump Technology",
				"Smart Operation Modes",
				"Touch Control Panel",
				"High Pressure Protection",
				"Corrosion Resistant Tank",
				"5 Years Tank Warranty",
			],
		},
	],
};

// Usage example:
const transformedData = transformProducts(data);
console.log(transformedData.length);
transformedData.forEach((product) => handleAddProduct(product));
