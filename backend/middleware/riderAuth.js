import jwt from "jsonwebtoken";
import Rider from "../models/riderModel.js";

const verifyRider = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		console.log(token);

		if (!token) {
			return res.status(401).json({ message: "Authentication required" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const rider = await Rider.findById(decoded.id);

		if (!rider) {
			return res.status(401).json({ message: "Invalid token" });
		}
		console.log(rider);

		req.rider = rider;
		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid token" });
	}
};

export default verifyRider;
