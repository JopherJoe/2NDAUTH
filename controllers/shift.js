const express = require('express');
const router = express.Router();
const ChangeCourse = require('../models/Shift');

// Route to create a new course change request
router.post('/request', async (req, res) => {
  try {
    // Extract course change request data from the request body
    const { firstname, lastname, previouscourse, newcourse, reason } = req.body;

    // Create a new course change request record in the database
    const courseChange = await ChangeCourse.create({
      firstname,
      lastname,
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

router.get('/get-request', async (req, res) =>{
    try{
        const courseChange = await ChangeCourse.find();
        res.status(200).json(courseChange);
    }catch (error){
        console.error('Error fetching course change request: ', error);
        res.status(500).json({message: 'An error occured while fetching course change request'})
    }
});

module.exports = router;