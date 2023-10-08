const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { log } = require('mercedlogger');
require('dotenv').config(); // Load environment variables from .env file

const app = express(); // Use the PORT from .env or fallback to 4000

app.use(bodyParser.json());

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions); // Use sendMail, not sendEmail
    log.green("Email sent successfully");
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
};

// Verify the email server connection
transporter.verify(function (error, success) {
  if (error) {
    console.log("Email server connection error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});




// Start the Express server
module.exports = { sendEmail };



