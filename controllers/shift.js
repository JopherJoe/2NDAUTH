const express = require('express');
const router = express.Router();
const ChangeCourse = require('../models/Shift');
const User = require('../models/User');

// Route to create a new course change request
router.post('/request', async (req, res) => {
  try {
    // Extract course change request data from the request body
    const { firstname, lastname, previouscourse, newcourse, reason, email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Email is required and must be a valid email address' });
    }

    // Create a new course change request record in the database
    const courseChange = await ChangeCourse.create({
      firstname,
      lastname,
      email,
      previouscourse, 
      newcourse,
      reason
    });

    // Respond with a success message or course change request data
    res.status(201).json({ message: 'Course change request submitted', courseChange });
  } catch (error) {
    console.error('Course change request error:', error);
    res.status(500).json({ error: 'Course change request failed' });
  }
});

// Route to approve a course change request
router.put('/approve-request/:id', async (req, res) => {
  try {
    const requestId = req.params.id;
    const updatedRequest = await ChangeCourse.findByIdAndUpdate(
      requestId,
      { status: 'Approved' },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: 'Course change request not found' });
    }

    const email = req.body.email;
    if (!email) {
        return res.status(400).json({ error: 'Email is required in the request body' });
    };

    const userId = updatedRequest.userId;
    const updatedCourse = updatedRequest.newcourse;
    console.log('User ID:', userId);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { course: updatedCourse },
      { new: true }
    );
    console.log('Updated User:', updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: 'Course Change Approved',
      text: 'Your course change request has been approved. Your new course is: ' + updatedCourse,
    };
    try {
      await sendEmail(mailOptions);
    } catch (error) {
      console.error('Email sending error:', error);
    }
    res.status(200).json({ message: 'Course change request approved', updatedRequest });
  } catch (error) {
    console.error('Course change request approval error:', error);
    res.status(500).json({ error: 'Course change request approval failed' });
  }
});


// Route to reject a course change request
router.put('/reject-request/:id', async (req, res) => {
  try {
    const requestId = req.params.id;

    // Update the course change request status to 'Rejected' in the database
    const updatedRequest = await ChangeCourse.findByIdAndUpdate(
      requestId,
      { status: 'Rejected' }, // Update 'status' field as needed
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: 'Course change request not found' });
    }

    // Respond with a success message or the updated request data
    res.status(200).json({ message: 'Course change request rejected', updatedRequest });
  } catch (error) {
    console.error('Course change request rejection error:', error);
    res.status(500).json({ error: 'Course change request rejection failed' });
  }
});

router.get('/get-request', async (req, res) => {
  try {
    const courseChange = await ChangeCourse.find();
    res.status(200).json(courseChange);
  } catch (error) {
    console.error('Error fetching course change request: ', error);
    res.status(500).json({ message: 'An error occurred while fetching course change request' });
  }
});

module.exports = router;
