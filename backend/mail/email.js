import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  SEND_WELCOME_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import nodemailer from "nodemailer";



export const sendVerificationEmail = async (email, verificationToken) => {
   //email người dùng

  let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.PASSWORD_EMAIL_SENDER,
    },
  });

  try {
    let info = await transport.sendMail({
      from: '"DDH Team" <ddhteam@gmail.com>',
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully", info);

  } catch (error) {
    console.error(`Error sending verification`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {

  let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.PASSWORD_EMAIL_SENDER,
    },
  });

  try {
    let info = await transport.sendMail({
      from: '"DDH Team" <ddhteam@gmail.com>',
      to: email,
      subject: "Welcome Email",
      html:SEND_WELCOME_TEMPLATE,
      category: "Welcome Email"
      
    });

    console.log("Email sent successfully", info);

   
  } catch (error) {
    console.log("Error seding welcome email", error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {


  let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.PASSWORD_EMAIL_SENDER,
    },
  });

  try {
    let info = await transport.sendMail({
      from: "DDH Team <ddhteam@gmail.com>",
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Error sending password email`, error);

    throw new Error(`Error sending password reset email ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {


  let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.PASSWORD_EMAIL_SENDER,
    },
  });

  try {
    let info = await transport.sendMail({
      from: '"DDH Team" <ddhteam@gmail.com',
      to: email,
      subject: "Password Reset Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", info);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);

    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

