import express from "express";
import path from "path";
import bcryptjs from "bcryptjs";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import User from "./models/user.model.js";
import Question from "./models/question.model.js";
import { connectDB } from "./lib/db.js";
import { fileURLToPath } from "url";
import { verifyToken } from "./middleware/verifyToken.js";
import { checkAuthenticated } from "./middleware/checkAuthenticated.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "./mail/email.js";


dotenv.config(); // Gọi config để tải các biến môi trường từ file .env

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.YOUR_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, //prevents XSS attacks, cross site scripting attack
    secure: false,
    sameSite: "strict", // prevents CSRF attack, cross site request forfery
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
const apiLimiter = rateLimit({ //Ngăn chặn brute force bằng cách giới hạn truy cập
  windowMs: 60 * 1000, // 1 minutes
  max: 2,
  handler: function (req, res) {
      res.status(429).send({
          status: 500,
          message: 'Too many requests!',
      });
  },
  // skip: (req, res) => {
  //     if(req.ip === '::ffff:127.0.0.1')
  //         return true;
  //     return false;
  // }
});


// Lấy __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//convert data into Json
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("frontend/pages"));
app.use(cookieParser());


const PORT = process.env.PORT || 5000;

app.get("/",checkAuthenticated, (req, res) => {
  return res.sendFile(path.join(__dirname, "../frontend/pages/Welcome.html"));
});

app.get("/login",checkAuthenticated,apiLimiter, (req, res) => {
  
  res.sendFile(path.join(__dirname, "../frontend/pages/Login.html"));
});

app.get("/signup",checkAuthenticated,  (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/SignUp.html"));
});

app.get("/verify-email",checkAuthenticated, (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/pages/VerifyEmailSignUp.html")
  );
});

app.get("/verify-email-login",checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/VerifyEmailLogin.html"));
});

app.get("/forgot-password",checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/ForgotPassword.html"));
});

app.get("/reset-password",checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/reset-password.html"));
});

app.get("/send-successful-email",checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/SendFPSuccess.html"));
});



app.get("/dashboard",verifyToken, (req, res) => {
  
  res.sendFile(path.join(__dirname, "../frontend/pages/dashboard.html"));
});

app.get("/api/prepareToExam", verifyToken, (req, res) => {
  // Lấy tham số từ query
  const subject = req.query.subject; // 'bmtt' hoặc 'ptdl'

  // Kiểm tra xem subject có giá trị hợp lệ không
  if (subject === 'bmtt') {
      res.sendFile(path.join(__dirname, "../frontend/pages/prepareToExamBMTT.html")); // Tệp HTML cho BẢO MẬT THÔNG TIN
  } else if (subject === 'ptdl') {
      res.sendFile(path.join(__dirname, "../frontend/pages/prepareToExamPTDL.html")); // Tệp HTML cho PHÂN TÍCH HỆ QUẢN DỮ LIỆU
  } else {
      res.status(404).send('Môn học không hợp lệ'); // Xử lý lỗi nếu môn học không hợp lệ
  }
});
app.get("/api/prepareToExam",verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/prepareToExam.html"));
});

app.post("/api/updateUser",verifyToken, async (req, res) => {
  const { name, dob, cccd, phone, email } = req.body;
  console.log(email);
  const user = await User.findOne({ email });
  console.log(user);
  if (user) {
    await User.updateOne(
      { email },
      {
        $set: {
          fullname: name,
          DayOfBirth: dob,
          cccd: cccd,
          phonenumber: phone,
        },
      }
    );

    return res.json({ success: true, message: "Updated successfully" });
  } else {
    return res.status(404).json({ success: false, message: "error" });
  }
});

app.get("/api/userInfo",verifyToken, async (req, res) => {
  const user = await User.findById(req.userId);
  if (user) {
    // Trả về thông tin người dùng
    res.json({
      success: true,
      user: {
        name: user.fullname,
        dob: user.DayOfBirth,
        email: user.email,
        cccd: user.cccd,
        phone: user.phonenumber,
        score: user.score,
      },
    });
  } else {
    res.json({
      success: false,
      message: "Người dùng chưa đăng nhập",
    });
  }
});

app.get("/questions",verifyToken, async (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/question.html"));
});

app.get("/api/questions",verifyToken, async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]); // Lấy ngẫu nhiên 10 câu hỏi
    res.json(questions); // Gửi câu hỏi đến client
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra khi lấy câu hỏi." });
  }
});
app.post("/signup", async (req, res) => {
  const { fullname, DayOfBirth, phonenumber, cccd, email, password } = req.body;

  const response_key = req.body["g-recaptcha-response"];
  const secret_key = process.env.SECRET_KEY_CAPTCHA;

  // Kiểm tra CAPTCHA
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

  try {
    const googleResponse = await fetch(url, {
      method: "POST",
    }).then((resp) => resp.json());

    if (!googleResponse.success) {
      return res
        .status(400)
        .json({ success: false, message: "Captcha verification failed" });
    }

    // Nếu CAPTCHA hợp lệ, kiểm tra thông tin người dùng

    if (
      !fullname ||
      !DayOfBirth ||
      !phonenumber ||
      !cccd ||
      !email ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    try {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const user = await User.create({
        fullname,
        DayOfBirth,
        phonenumber,
        cccd,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 tiếng
      });

      await user.save();

      generateTokenAndSetCookie(res, user._id);

      await sendVerificationEmail(user.email, verificationToken);

      res.status(201).json({
        redirectUrl: `/verify-email?email=${encodeURIComponent(user.email)}`,
      });
    } catch (error) {
      console.log("Error in signup controller", error.message);
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    console.error("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/verify-email", async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/verify-email-login", async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.isLoggedIn = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const response_key = req.body["g-recaptcha-response"];
  const secret_key = process.env.SECRET_KEY_CAPTCHA;

  // Kiểm tra CAPTCHA
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

  try {
    const googleResponse = await fetch(url, {
      method: "POST",
    }).then((resp) => resp.json());

    if (!googleResponse.success) {
      return res
        .status(400)
        .json({ success: false, message: "Captcha verification failed" });
    }

    // Nếu CAPTCHA hợp lệ, kiểm tra thông tin người dùng
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not exists" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Your email or password is wrong" });
    }

    // Ghi nhận thông tin đăng nhập hợp lệ
    generateTokenAndSetCookie(res, user._id);

    // Tạo mã xác minh và gửi email
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 giờ

    await sendVerificationEmail(user.email, verificationToken);
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      redirectUrl: `/verify-email-login?email=${encodeURIComponent(
        user.email
      )}`,
    });
  } catch (error) {
    console.error("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    console.log("resetToken", resetToken);
    console.log("resetTokenExpiresAt", resetTokenExpiresAt);
    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log("password", password);
    console.log("debug1", token);
    console.log("Current Time: ", Date.now());

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// //Thêm câu hỏi
// app.post("/api/questions", async (req, res) => {
//   const questions = req.body; // expecting an array of question objects
//   console.log("Received:", questions);

//   // Check if the request body is an array and it has at least one question
//   if (!Array.isArray(questions) || questions.length === 0) {
//     return res
//       .status(400)
//       .send("Invalid request body. Expected an array of questions.");
//   }

//   // Validate each question in the array
//   for (let questionObj of questions) {
//     const { question, options, answer } = questionObj;
//     if (!question || !options || !answer) {
//       return res.status(400).send("Missing fields in one or more questions.");
//     }
//   }

//   try {
//     // Insert all questions using insertMany
//     const newQuestions = await Question.insertMany(questions);
//     res
//       .status(201)
//       .send(`${newQuestions.length} questions added successfully!`);
//   } catch (err) {
//     console.error("Error adding questions:", err);
//     res.status(500).send("Error adding questions");
//   }
// });

// // API sửa câu hỏi
// app.put("/api/questions/:id", async (req, res) => {
//   const { question, options, answer } = req.body;
//   await Question.findByIdAndUpdate(req.params.id, {
//     question,
//     options,
//     answer,
//   });
//   res.send("Question updated successfully!");
// });

app.post("/api/prepareToExam",verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "Người dùng không hợp lệ." });
    }

    res
      .status(200)
      .json({ success: true, message: "Đã chuẩn bị xong cho kỳ thi." });
  } catch (error) {
    console.error("Lỗi trong quá trình chuẩn bị thi:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/result", verifyToken, async (req, res) => {
  try {
    const userAnswers = req.body; // Nhận câu trả lời của người dùng
    const questionIds = Object.keys(userAnswers);

    // Lấy các câu hỏi từ database
    const questions = await Question.find({ _id: { $in: questionIds } });

    let score = 0;
    questions.forEach((question) => {
      const userAnswer = userAnswers[question._id]; // Lấy câu trả lời của người dùng theo _id
      console.log(
        `User answer: ${userAnswer}, Correct answer: ${question.answer}`
      );
      if (userAnswer === question.answer) {
        score++;
      }
    });

    // Cập nhật điểm số cho người dùng
    const user = await User.findById(req.userId);
    if (score1 === undefined) {
      user.score1 = score; // Cập nhật điểm
    } else {
      user.score2 = score;
    }
    
    await user.save();

    res.json({ score, total: questions.length }); // Trả về điểm số và tổng số câu hỏi
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Có lỗi xảy ra khi xử lý kết quả." });
  }
});
app.post("/logout", verifyToken, async (req, res) => {
  const user = await User.findById(req.userId);
  user.isLoggedIn = false;
  await user.save();
  res.clearCookie("token");
  
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
