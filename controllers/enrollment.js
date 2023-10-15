const { Router } = require('express');
const Enrollment = require('../models/Enrollment'); // Assuming you have a model for enrollments
const { isLoggedIn } = require("./middleware");
const { sendEmail } = require('./email');

const router = Router();

router.post('/', isLoggedIn, async (req, res) => {
  try {

    console.log('req.user:', req.user);

    const { course, 
      firstname, 
      lastname, 
      email, 
      contact_no,
      guardian_contact, 
      age, birthdate, 
      mothername,
      fathername,
      address,
      elemschool,
      juniorschool,
      seniorschool,
      gender 
    } = req.body;

    const enrollment = await Enrollment.create({
      course,
      firstname,
      lastname,
      email,
      contact_no,
      guardian_contact, 
      age, birthdate, 
      mothername,
      fathername,
      address,
      elemschool,
      juniorschool,
      seniorschool,
      gender,
      userId: req.user.id,
      enrolled: true
    });

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

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { course },
      { new: true }
    );

    if (!updatedEnrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.status(200).json({ message: 'Enrollment updated', updatedEnrollment });
  } catch (error) {
    console.error('Enrollment update error:', error);
    res.status(500).json({ error: 'Enrollment update failed', details: error.message });
  }
});



// Add more routes for managing enrollments if needed

module.exports = router;
