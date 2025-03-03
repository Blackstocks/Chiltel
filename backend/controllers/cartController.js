import userModel from "../models/userModel.js";
import Cart from "../models/cartModel.js";


const addToCart = async (req, res) => {
	try {
		const { userId, itemId, price, name, image, category } = req.body;

		// Ensure the user exists
		console.log('userId: ', userId);
		const userData = await userModel.findById(userId);
		if (!userData) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		// Find or create a cart for the user
		let cart = await Cart.findOne({ userId });

		// If cart does not exist, create a new one
		if (!cart) {
			cart = new Cart({
				userId,
				items: [],
			});
		}
		// Find the existing cart item if it exists
		let cartItem = cart.items.find(
			(item) =>
				item.productId.toString() === itemId && item.category === category
		);

		if (cartItem) {
			// If the item already exists, increase the quantity
			cartItem.quantity += 1;
		} else {
			// If the item doesn't exist, create a new item and push to cart
			const newItem = {
				productId: itemId,
				category,
				quantity: 1,
				price,
				name,
				image,
			};
			cart.items.push(newItem);
		}

		// Save the cart (either updating an existing cart or saving a new one)
		await cart.save();

		res.json({ success: true, message: "Item added to cart", cart });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Update user cart
const updateCart = async (req, res) => {
	try {
		const { userId, itemId, quantity } = req.body;

		if (quantity == 0) {
			return await removeFromCart(req, res);
		}

		if (quantity <= 0) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Quantity must be greater than zero",
				});
		}

		const userData = await userModel.findById(userId);
		if (!userData) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		let cart = await Cart.findOne({ userId });

		let cartItem = cart.items.find(
			(item) => item.productId.toString() === itemId
		);
		if (cartItem) {
			cartItem.quantity = quantity;
		} else {
			return res.status(404).json({
				success: false,
				message: "Product not found in cart",
			});
		}

		// Save the cart (either updating an existing cart or saving a new one)
		await cart.save();

		res.json({ success: true, message: "Item added to cart", cart });

		// Update the cartData in the database
		// await userModel.findByIdAndUpdate(userId, { cartData });

		// res.json({ success: true, message: "Cart updated" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

const removeFromCart = async (req, res) => {
	try {
		const { userId, itemId } = req.body;

		if (!userId || !itemId) {
			return res.status(400).json({
				success: false,
				message: "userId and itemId are required",
			});
		}

		// Find the user's cart
		const cart = await Cart.findOne({ userId });

		if (!cart) {
			return res.status(404).json({
				success: false,
				message: "Cart not found",
			});
		}

		// Find the item index in the cart based on itemId
		const itemIndex = cart.items.findIndex(
			(item) => item.productId.toString() === itemId
		);

		if (itemIndex === -1) {
			return res.status(404).json({
				success: false,
				message: "Item not found in cart",
			});
		}

		// Remove the item from the cart
		cart.items.splice(itemIndex, 1);

		// Save the updated cart
		await cart.save();

		res.status(200).json({
			success: true,
			message: "Item removed from cart",
			cartData: cart,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const cartData = await Cart.findOne({userId: userId});

        res.json({ success: true, cartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, removeFromCart, getUserCart };
