require("dotenv").config();
const { Router } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer'); // Add nodemailer
const emailConfig = require('./email'); // Add email configuration
const { log } = require('mercedlogger');
const { sendEmail } = require('./email');

const router = Router();

const { SECRET } = process.env;


// Signup route to create a new user
router.post("/signup", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: req.body.email,
    subject: 'Welcome to Your App',
    text: 'Thank you for signing up!',
  };
  
  await sendEmail(mailOptions);
});

// Login route to verify a user and get a token
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        const SECRET = process.env.JWT_SECRET || 'jopher123456';
        
        // Include user profile data in the payload
        const payload = {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          id: user._id, // or any other user identifier
        };

        const token = jwt.sign(payload, SECRET);

        // Return the token and user profile data in the response
        const userProfile = {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          id: user._id,
        };

        res.json({ token, userProfile });
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Forgot Password Route: Generate and send reset token to the user's email
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: 'Email not found' });
      }
  
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
  
      const mailOptions = {
        from: process.env.EMAIL_HOST,
        to: process.env.EMAIL_USER,
        subject: 'Password Reset Request',
        text: `HERE IS THE TOKEN TO REST THE PASSWORD ${resetLink}`,
      };
  
      await sendEmail(mailOptions);
  
      res.status(200).json({ message: 'The token was sent to your email' });
    } catch (error) {
      console.error('Email sending error:', error);
      res.status(500).json({ error: 'Failed to send reset email' });
    }
  });
  
// Reset Password Route: Verify token and update password
// Reset Password Route: Verify token and update password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;

  try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the token has expired
      if (Date.now() >= decoded.exp * 1000) {
          console.log('Token has expired'); // Debugging line
          return res.status(401).json({ error: 'Token has expired' });
      }

      // Ensure 'newPassword' exists in the request body
      if (!req.body.newPassword) {
          console.log('New password is missing in the request.'); // Debugging line
          return res.status(400).json({ error: 'New password is required' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

      // Find and update the user's password based on the decoded email
      const user = await User.findOneAndUpdate(
          { email: decoded.email },
          { password: hashedPassword }
      );

      // Respond with a success message
      res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
      console.error('Token verification error:', error);
      res.status(400).json({ error: 'Invalid or expired token' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "An error occurred while deleting the todo" });
  }
});




  


module.exports = router;
