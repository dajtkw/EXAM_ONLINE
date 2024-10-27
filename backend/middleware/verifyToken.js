import jwt from "jsonwebtoken";
import User from "../models/user.model.js";



export const verifyToken = async(req, res, next) => {
	const token = req.cookies.token;
	
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	try {
		const decoded = jwt.verify(token, process.env.YOUR_SECRET_KEY);
		const user = await User.findById(decoded.userId);

		if (!decoded || !user.isLoggedIn) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

		req.userId = decoded.userId;
		next();
	} catch (error) {
		console.log("Error in verifyToken ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};