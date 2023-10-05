const { Router } = require("express");
const Todo = require("../models/Todo");
const { isLoggedIn } = require("./middleware");
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

const router = Router();
router.get('/', async (req, res) => {
  try {
    // Get the user's ID from the authenticated user's token
    const { id: userId } = req.user;

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
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Fetch enrollment data for the user
    const enrollment = await Enrollment.findOne({ userId: userId });
    
    // Combine user and enrollment data into a single object
    const profileData = {
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        contact_no: user.contact_no,
        // Add any other user fields you need
      },
      enrollment: {
        course: enrollment.course,
        // Add any other enrollment fields you need
      },
    };

    res.status(200).json(profileData);
  } catch (error) {
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