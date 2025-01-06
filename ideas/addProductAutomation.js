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
	"back-bar-chiller": [
		{
			id: 1,
			name: "Rockwell BB220C Back Bar Cooler",
			image: "https://m.media-amazon.com/images/I/41X5TU9WHQL.SX522.jpg",
			originalPrice: "59990",
			discountedPrice: "54990",
			brand: "Rockwell",
			rating: 4.2,
			reviews: 45,
			specifications: {
				brand: "Rockwell",
				model: "BB220C",
				type: "Back Bar Chiller",
				capacity: "220L",
				doorType: "Double Glass Door",
				temperature: "2°C to 8°C",
			},
			features: [
				"Digital Temperature Controller",
				"LED Interior Lighting",
				"Adjustable Shelves",
				"Auto Defrost",
				"Energy Efficient",
				"Lock System",
			],
		},
		{
			id: 2,
			name: "Celfrost Back Bar Chiller BBC-300",
			image:
				"https://products.industrybuying.com/api/products/celfrost-double-door-back-bar-chiller-565-ltr-bbc-300-521344221/images/521344221-1",
			originalPrice: "78990",
			discountedPrice: "72990",
			brand: "Celfrost",
			rating: 4.4,
			reviews: 62,
			specifications: {
				brand: "Celfrost",
				model: "BBC-300",
				type: "Back Bar Chiller",
				capacity: "300L",
				doorType: "Double Glass Door",
				temperature: "2°C to 10°C",
			},
			features: [
				"Forced Air Cooling",
				"Digital Temperature Display",
				"Self-Closing Doors",
				"Adjustable Shelves",
				"Interior LED Lighting",
				"Heavy Duty Castors",
			],
		},
		{
			id: 3,
			name: "Rockwell Premium Back Bar Chiller",
			image:
				"https://products.industrybuying.com/api/products/rockwell-back-bar-chiller-rbb-300-826056465/images/826056465-1",
			originalPrice: "69990",
			discountedPrice: "64990",
			brand: "Rockwell",
			rating: 4.3,
			reviews: 38,
			specifications: {
				brand: "Rockwell",
				model: "RBB-300",
				type: "Back Bar Chiller",
				capacity: "300L",
				doorType: "Double Glass Door",
				temperature: "2°C to 8°C",
			},
			features: [
				"Dynamic Cooling System",
				"Electronic Temperature Control",
				"Double Layer Glass Door",
				"Adjustable Shelves",
				"Lock Facility",
				"Energy Efficient Compressor",
			],
		},
		{
			id: 4,
			name: "Elanpro Back Bar Cooler",
			image:
				"https://products.industrybuying.com/api/products/elanpro-back-bar-chiller-ebc-300-2d-309269/images/309269-1",
			originalPrice: "82990",
			discountedPrice: "76990",
			brand: "Elanpro",
			rating: 4.5,
			reviews: 55,
			specifications: {
				brand: "Elanpro",
				model: "EBC-300-2D",
				type: "Back Bar Chiller",
				capacity: "300L",
				doorType: "Double Glass Door",
				temperature: "1°C to 10°C",
			},
			features: [
				"Forced Air Circulation",
				"Digital Temperature Control",
				"Auto Defrost",
				"LED Display",
				"Adjustable Shelves",
				"High Efficiency Compressor",
			],
		},
		{
			id: 5,
			name: "Western Back Bar Chiller Pro",
			image:
				"https://5.imimg.com/data5/SELLER/Default/2021/3/KN/VG/UZ/3037913/back-bar-chiller-500x500.jpg",
			originalPrice: "65990",
			discountedPrice: "61990",
			brand: "Western",
			rating: 4.1,
			reviews: 42,
			specifications: {
				brand: "Western",
				model: "BBC-250",
				type: "Back Bar Chiller",
				capacity: "250L",
				doorType: "Double Glass Door",
				temperature: "2°C to 8°C",
			},
			features: [
				"Double Glass Door",
				"Digital Temperature Display",
				"Interior LED Light",
				"Adjustable Shelves",
				"Auto Defrost",
				"Energy Saving Mode",
			],
		},
		{
			id: 6,
			name: "Saicon Commercial Back Bar Chiller",
			image: "https://www.saiconsales.com/uploads/tiny_mce/backbar.jpg",
			originalPrice: "71990",
			discountedPrice: "67990",
			brand: "Saicon",
			rating: 4.2,
			reviews: 35,
			specifications: {
				brand: "Saicon",
				model: "SBC-330",
				type: "Back Bar Chiller",
				capacity: "330L",
				doorType: "Double Glass Door",
				temperature: "2°C to 10°C",
			},
			features: [
				"Forced Air Cooling",
				"Digital Temperature Controller",
				"Double Glazed Door",
				"Adjustable Shelves",
				"Heavy Duty Casters",
				"Energy Efficient Operation",
			],
		},
	],
	"food-prep-chiller": [
		{
			id: 1,
			name: "Elanpro Under Counter Chiller UCB 270",
			image:
				"https://products.industrybuying.com/api/products/elanpro-under-counter-chiller-ucb-270-309253/images/309253-1",
			originalPrice: "89990",
			discountedPrice: "82990",
			brand: "Elanpro",
			rating: 4.3,
			reviews: 48,
			specifications: {
				brand: "Elanpro",
				model: "UCB 270",
				type: "Under Counter Chiller",
				capacity: "270L",
				doorType: "2 Door",
				temperature: "2°C to 8°C",
			},
			features: [
				"Digital Temperature Control",
				"Forced Air Cooling",
				"Auto Defrost",
				"Adjustable Shelves",
				"Energy Efficient",
				"Stainless Steel Construction",
			],
		},
		{
			id: 2,
			name: "Celfrost Under Counter Chiller Two Door",
			image:
				"https://products.industrybuying.com/api/products/celfrost-under-counter-chiller-two-door-58233544/images/58233544-1",
			originalPrice: "92990",
			discountedPrice: "86990",
			brand: "Celfrost",
			rating: 4.4,
			reviews: 56,
			specifications: {
				brand: "Celfrost",
				model: "UC-300",
				type: "Under Counter Chiller",
				capacity: "300L",
				doorType: "2 Door",
				temperature: "1°C to 10°C",
			},
			features: [
				"Fan Assisted Cooling",
				"Digital Controller",
				"Self-Closing Doors",
				"Adjustable Legs",
				"Heavy Duty Castors",
				"Interior LED Light",
			],
		},
		{
			id: 3,
			name: "Celfrost Salad Counter Three Door",
			image:
				"https://products.industrybuying.com/api/products/celfrost-salad-counter-three-door-78233535/images/78233535-1",
			originalPrice: "112990",
			discountedPrice: "104990",
			brand: "Celfrost",
			rating: 4.5,
			reviews: 42,
			specifications: {
				brand: "Celfrost",
				model: "SC-180",
				type: "Salad Counter",
				capacity: "420L",
				doorType: "3 Door",
				temperature: "2°C to 8°C",
			},
			features: [
				"GN Pan Support",
				"Sandwich Top",
				"Digital Temperature Display",
				"Auto Defrost",
				"Forced Air Cooling",
				"Stainless Steel Work Surface",
			],
		},
		{
			id: 4,
			name: "Trufrost Food Prep Counter",
			image:
				"https://products.industrybuying.com/api/products/trufrost-food-prep-counter-96499525/images/96499525-1",
			originalPrice: "98990",
			discountedPrice: "92990",
			brand: "Trufrost",
			rating: 4.2,
			reviews: 35,
			specifications: {
				brand: "Trufrost",
				model: "GN2100TN",
				type: "Food Prep Counter",
				capacity: "340L",
				doorType: "2 Door",
				temperature: "2°C to 10°C",
			},
			features: [
				"Gastronorm Compatible",
				"Digital Control Panel",
				"Forced Air Circulation",
				"Auto Defrost",
				"Adjustable Shelves",
				"Energy Saving Mode",
			],
		},
		{
			id: 5,
			name: "Jonree Commercial Salad Counter Chiller",
			image: "https://www.vhsindia.in/uploads/product/1689866271_1.jpg",
			originalPrice: "115990",
			discountedPrice: "108990",
			brand: "Jonree",
			rating: 4.3,
			reviews: 38,
			specifications: {
				brand: "Jonree",
				model: "SC-380",
				type: "Salad Counter",
				capacity: "380L",
				doorType: "3 Door",
				temperature: "2°C to 8°C",
			},
			features: [
				"8 Pan Capacity",
				"Stainless Steel Body",
				"Digital Temperature Control",
				"Efficient Cooling System",
				"Auto Defrost",
				"Adjustable Feet",
			],
		},
		{
			id: 6,
			name: "Trufrost Under Counter Chiller",
			image:
				"https://products.industrybuying.com/api/products/trufrost-under-counter-chiller-106499503/images/106499503-1",
			originalPrice: "86990",
			discountedPrice: "79990",
			brand: "Trufrost",
			rating: 4.1,
			reviews: 32,
			specifications: {
				brand: "Trufrost",
				model: "TUC250",
				type: "Under Counter Chiller",
				capacity: "250L",
				doorType: "2 Door",
				temperature: "1°C to 10°C",
			},
			features: [
				"Ventilated Cooling",
				"Electronic Thermostat",
				"Auto Defrost",
				"Adjustable Shelves",
				"Heavy Duty Construction",
				"Energy Efficient Design",
			],
		},
	],
};

// Usage example:
const transformedData = transformProducts(data);
console.log(transformedData.length);
transformedData.forEach((product) => handleAddProduct(product));
