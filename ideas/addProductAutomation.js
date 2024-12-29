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
	"Visi Cooler": [
		{
			id: 1,
			name: "Blue Star 300L Single Door Visi Cooler",
			image: "https://m.media-amazon.com/images/I/41Q5KiNMYhL.SX522.jpg",
			originalPrice: "39990",
			discountedPrice: "34990",
			brand: "Blue Star",
			rating: 4.2,
			reviews: 876,
			specifications: {
				brand: "Blue Star",
				model: "SC300F",
				capacity: "300L",
				doorType: "Single Door",
				shelfCount: "5",
				temperatureRange: "2°C to 8°C",
				powerConsumption: "180W",
				dimensions: "60D x 55W x 175H cm",
			},
			features: [
				"Double Glass Door",
				"LED Lighting",
				"Adjustable Shelves",
				"Digital Temperature Display",
				"Auto Defrost",
				"Eco-Friendly Refrigerant",
			],
		},
		{
			id: 2,
			name: "Western Commercial Visi Cooler",
			image: "https://m.media-amazon.com/images/I/51POqPJ6v+L.SX522.jpg",
			originalPrice: "42990",
			discountedPrice: "36990",
			brand: "Western",
			rating: 4.0,
			reviews: 654,
			specifications: {
				brand: "Western",
				model: "SRC-500-GL",
				capacity: "500L",
				doorType: "Double Door",
				shelfCount: "6",
				temperatureRange: "2°C to 10°C",
				powerConsumption: "220W",
				dimensions: "65D x 60W x 185H cm",
			},
			features: [
				"Bottom Mounted Compressor",
				"Forced Air Cooling",
				"Adjustable Wire Shelves",
				"Enhanced Visibility",
				"Heavy Duty Castors",
				"Lock Facility",
			],
		},
		{
			id: 3,
			name: "Blue Star Visi Cooler with Temperature Display",
			image: "https://m.media-amazon.com/images/I/61J4CzL6GPL.SX522.jpg",
			originalPrice: "35990",
			discountedPrice: "31990",
			brand: "Blue Star",
			rating: 4.3,
			reviews: 923,
			specifications: {
				brand: "Blue Star",
				model: "VC65D",
				capacity: "650L",
				doorType: "Double Door",
				shelfCount: "4",
				temperatureRange: "1°C to 10°C",
				powerConsumption: "250W",
				dimensions: "70D x 65W x 190H cm",
			},
			features: [
				"Digital Temperature Controller",
				"Fan-Forced Cooling",
				"Adjustable Shelves",
				"Interior LED Light",
				"Lockable Doors",
				"Energy Efficient",
			],
		},
		{
			id: 4,
			name: "Voltas 425L Visi Cooler",
			image: "https://m.media-amazon.com/images/I/61se0mGuqKL.SX522.jpg",
			originalPrice: "37990",
			discountedPrice: "32990",
			brand: "Voltas",
			rating: 4.1,
			reviews: 745,
			specifications: {
				brand: "Voltas",
				model: "425VC",
				capacity: "425L",
				doorType: "Single Door",
				shelfCount: "5",
				temperatureRange: "2°C to 8°C",
				powerConsumption: "200W",
				dimensions: "62D x 58W x 180H cm",
			},
			features: [
				"Double Layer Glass Door",
				"Uniform Cooling",
				"Adjustable Shelves",
				"Temperature Display",
				"Mobile Castors",
				"CFC Free Cooling",
			],
		},
	],
};

// Usage example:
const transformedData = transformProducts(data);
console.log(transformedData.length);
transformedData.forEach((product) => handleAddProduct(product));
