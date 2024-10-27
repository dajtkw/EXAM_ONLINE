import User from '../models/user.model.js'; // Đảm bảo đường dẫn đúng

export const resetUserStatesOnStartup = async () => {
    try {
        await User.updateMany({}, { isLoggedIn: true });
        console.log("All user login statuses have been reset to false.");
    } catch (error) {
        console.error("Error resetting user states:", error);
    }
};  