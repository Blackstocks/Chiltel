import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
	// const { token } = req.headers;
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.json({ success: false, message: "Not Authorized Login Againnn" });
	}

	try {
		//console.log(token);
		const token_decode = jwt.verify(token, process.env.JWT_SECRET);
		req.body.email = token_decode.email;
		next();
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export default authUser;
