const { Router } = require("express");
const Todo = require("../models/Todo");
const { isLoggedIn } = require("./middleware");
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

const router = Router();
router.get('/', async (req, res) => {
  try {
    // Get the user's ID from the authenticated user's token
    const userId = req.user.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with the user data
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'An error occurred while fetching user data' });
  }
});


router.get('/findById/:id', isLoggedIn, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('Fetching profile for user ID:', userId);

    const user = await User.findById(userId);
    console.log('User:', user);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    const enrollment = await Enrollment.findOne({ userId: userId });
    console.log('Enrollment:', enrollment);

    // You need to create account first and enroll to display the data
    /*if (!enrollment) {
      console.log('Enrollment data not found');
      return res.status(404).json({ message: 'Enrollment data not found' });
    }*/

    const profileData = {
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        contact_no: user.contact_no,
      },
      enrollment: {
        course:  enrollment ? enrollment.course : 'Not enrolled',
      },
    };
    res.status(200).json(profileData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
});


router.post("/",  async (req, res) => {
  const { username } = req.user; 
  req.body.username = username;
  res.json(
    await Todo.create(req.body).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

router.put("/:id", async (req, res) => {
  const { username } = req.user;
  req.body.username = username;
  const _id = req.params.id;
  res.json(
    await Todo.updateOne({ username, _id }, req.body, { new: true }).catch(
      (error) => res.status(400).json({ error })
    )
  );
});

router.delete('/delete/:id', async (req, res) =>{
  try {
      const task = await Todo.findByIdAndRemove(req.params.id);
      res.json(task);
  } catch (error) {
      res.status(400).json({ error: error.message})
  }
});


module.exports = router