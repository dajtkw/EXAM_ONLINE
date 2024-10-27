import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
	{
		fullname: {
			type: String,
			required: [true, "Name is required"],
		},

        DayOfBirth: {
			type: Date,
			required: [true, "DayOfBirth is required"],
		},

        cccd: {
			type: String,
			required: [true, "cccd is required"],
		},

        phonenumber: {
			type: String,
			required: [true, "Phone Number is required"],
		},

		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},

        
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
		},
		role: {
			type: String,
			enum: ["Học sinh", "admin"],
			default: "Học sinh",
		},

		lastLogin: {
			type : Date,
			default: Date.now
		},

		isVerified: {
			type: Boolean,
			default: false,
		},
		isLoggedIn: { type: Boolean, default: false },
		score1: String,
		score2: String,

		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{
		timestamps: true,
	}
);


const User = mongoose.model("User", userSchema);

export default User;