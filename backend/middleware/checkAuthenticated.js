import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const checkAuthenticated = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.YOUR_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return next(); // Token không hợp lệ
            }

            const user = await User.findById(decoded.userId);

            if (!user) {
                return next(); // Người dùng không tồn tại
            }

            // Nếu người dùng đã xác minh, chuyển họ đến dashboard
            if (user.isVerified && user.isLoggedIn) {
                return res.redirect("/dashboard");
            } else {
                // Nếu chưa xác minh, chuyển đến trang nhập mã xác nhận
                return next();
            }
        });
    } else {
        // Nếu không có token, cho phép truy cập vào route
        return next();
    }
};
