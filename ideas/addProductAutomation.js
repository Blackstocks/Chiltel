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
				price: originalPrice || 1,
				discount: discountValue || 0,
				rating: Math.min(Math.max(product.rating, 0), 5),
				reviews: Math.max(product.reviews, 0),
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

// Usage example:
const transformedData = transformProducts(productsData);
console.log(transformedData.length);
transformedData.forEach((product) => handleAddProduct(product));
