// User Schema
const userSchema = {
	username: String,
	email: { type: String, unique: true },
	password: String,
	phoneNumber: String,
	address: {
		street: String,
		city: String,
		state: String,
		zipCode: String,
	},
	registeredAt: { type: Date, default: Date.now },
	orders: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
		},
	],
	serviceRequests: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "ServiceRequest",
		},
	],
};

// Rider Schema
const riderSchema = {
	name: String,
	email: { type: String, unique: true },
	password: String,
	phoneNumber: String,
	status: {
		type: String,
		enum: ["AVAILABLE", "BUSY", "OFFLINE"],
		default: "OFFLINE",
	},
	assignedServices: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "ServiceRequest",
		},
	],
	rating: {
		average: { type: Number, default: 0 },
		count: { type: Number, default: 0 },
	},
	location: {
		type: {
			type: String,
			enum: ["Point"],
			default: "Point",
		},
		coordinates: {
			type: [Number], // [longitude, latitude]
			required: true,
		},
	},
};

// Admin Schema
const adminSchema = {
	username: String,
	email: { type: String, unique: true },
	password: String,
	role: {
		type: String,
		enum: ["SUPER_ADMIN", "MANAGER", "SUPPORT"],
		required: true,
	},
	permissions: [String],
	lastLogin: Date,
};



// Product Schema
const productSchema = {
	name: String,
	description: String,
	price: Number,
	category: String,
	inStock: Boolean,
	images: [String],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
};

// Service Schema
const serviceSchema = {
	name: String,
	description: String,
	basePrice: Number,
	category: String,
	estimatedDuration: Number, // in minutes
	isAvailable: Boolean,
	requirements: [String],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
};

// Order Schema (for products)
const orderSchema = {
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	products: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
			quantity: Number,
			price: Number,
		},
	],
	totalAmount: Number,
	status: {
		type: String,
		enum: ["PENDING", "PAID", "ORDERED", "COMPLETED"],
		default: "PENDING",
	},
	paymentDetails: {
		method: String,
		transactionId: String,
		paidAt: Date,
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
};

// Service Request Schema
const serviceRequestSchema = {
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	service: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Service",
		required: true,
	},
	rider: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Rider",
	},
	status: {
		type: String,
		enum: ["CREATED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
		default: "CREATED",
	},
	location: {
		type: {
			type: String,
			enum: ["Point"],
			default: "Point",
		},
		coordinates: [Number], // [longitude, latitude]
		address: String,
	},
	scheduledFor: Date,
	price: Number,
	paymentStatus: {
		type: String,
		enum: ["PENDING", "PAID", "REFUNDED"],
		default: "PENDING",
	},
	paymentDetails: {
		method: String,
		transactionId: String,
		paidAt: Date,
	},
	notes: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	completedAt: Date,
};

// Rating Schema
const ratingSchema = {
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	rider: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Rider",
		required: true,
	},
	serviceRequest: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "ServiceRequest",
		required: true,
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5,
	},
	comment: String,
	createdAt: { type: Date, default: Date.now },
};
