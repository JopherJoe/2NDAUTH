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
  secure: false, // Set to true if you're using port 465 with SSL, false for port 587 with STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify the email server connection
transporter.verify(function (error, success) {
  if (error) {
    console.log("Email server connection error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// Endpoint to send email notifications
app.post('/send-email-notification', (req, res) => {
  const { recipientEmail, subject, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address from .env
    to: recipientEmail, // Recipient's email address
    subject,
    text: message,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ error: 'Failed to send email notification' });
    } else {
      log.green("Email sent successfully");
      res.status(200).json({ message: 'Email notification sent successfully' });
    }
  });
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Email server connection error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
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

// Start the Express server

module.exports = { sendEmail };



