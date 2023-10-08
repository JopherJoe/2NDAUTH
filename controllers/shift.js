const express = require('express');
const router = express.Router();
const ChangeCourse = require('../models/Shift');
require("dotenv").config();
const { sendEmail } = require('./email');

// Route to create a new course change request
router.post('/request', async (req, res) => {
  try {
    // Extract course change request data from the request body
    const { firstname, lastname, previouscourse, newcourse, reason, email } = req.body;

    if (!email) {
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
  const requestOption = {
    from: process.env.EMAIL_USER,
    to: req.body.email,
    text: "Your change course has been sent",
    subject: "Thank you for reaching us"
  }
    await sendEmail(requestOption);
});

router.post ('/request-approve/:id', async (req, res) =>{
  try {
    const requestId = req.params.id;
    const approveRequest = await ChangeCourse.findById(requestId);

    if (!approveRequest){
      return res.status(400).json({message: 'this is Undefined'});
    }

    const recipientEmail = req.body.email;
    if(!recipientEmail){
      return res.status(400).json({message: 'Recipient email is missing'});
    }
    res.status(200).json({message: 'Your request has been approved', approveRequest});
  } catch (error) {
    res.status(500).json({message: 'error'})
  }
  const approveOption ={
    from: process.env.EMAIL_USER,
    to: req.body.email,
    text: 'Congratulations, We would like to inform you that your change request has been APPROVED!',
    subject: 'CHANGE COURSE APPROVE'
  }
  await sendEmail(approveOption);
});

router.post ('/request-reject/:id', async (req, res) =>{
    try {
      const requestId = req.params.id;
      const rejectRequest = await ChangeCourse.findById(requestId);

      if(!rejectRequest){
        return res.status(400).json({message: 'This is Undefined'});
      }
      res.status(200).json({message: 'Your request has been rejected',rejectRequest});
    } catch (error){
      res.status(500).json({message: 'Error'})
    }
    const rejectOption = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      text: 'Sorry, we would like to inform you that your change course was rejected',
      subject: 'CHANGE COURSE REJECTED'
    }
    await sendEmail(rejectOption);
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
