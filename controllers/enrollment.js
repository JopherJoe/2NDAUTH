const { Router } = require('express');
const Enrollment = require('../models/Enrollment'); // Assuming you have a model for enrollments
const { isLoggedIn } = require("./middleware");
const { sendEmail } = require('./email');

const router = Router();

// Route to enroll a student in a course
router.post('/', isLoggedIn, async (req, res) => {
  try {
    // Ensure that req.user is set correctly
    console.log('req.user:', req.user);

    // Extract enrollment data from the request body
    const { course, firstname, lastname, email, contact_no } = req.body;

    // Create a new enrollment record in the database
    const enrollment = await Enrollment.create({
      course,
      firstname,
      lastname,
      email,
      contact_no,
      userId: req.user.id // Set the user ID from req.user
    });

    // Respond with a success message or enrollment data
    res.status(201).json({ message: 'Enrollment successful', enrollment });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Enrollment failed' });
  }
});

router.get('/get', async (req, res) => {
  try {
    const students = await Enrollment.find();

    if (students.length > 0) {
      res.status(200).json(students);
    } else {
      res.status(404).json({ message: 'No records found' });
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'An error occurred while fetching students' });
  }
});
router.put('/update/:id', isLoggedIn, async (req, res) => {
  try {
    const { course } = req.body;
    const enrollmentId = req.params.id;

    // Find the enrollment by ID and update its course field
    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { course },
      { new: true }
    );

    if (!updatedEnrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Send an email notification
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email address
      to: process.env.EMAIL_HOST, // Admin's email address
      subject: 'BSCS', // You can specify the subject here
      text: `Course update requested for enrollment ID: ${enrollmentId}`, // You can add the enrollment ID or other details here
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Enrollment updated', updatedEnrollment });
  } catch (error) {
    console.error('Enrollment update error:', error);
    res.status(500).json({ error: 'Enrollment update failed', details: error.message });
  }
});



// Add more routes for managing enrollments if needed

module.exports = router;
