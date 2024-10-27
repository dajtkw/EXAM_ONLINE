import mongoose from "mongoose";
import { resetUserStatesOnStartup } from "../middleware/checkLogin.js";


export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		resetUserStatesOnStartup();
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connecting to MONGODB", error.message);
		process.exit(1);
	}
};