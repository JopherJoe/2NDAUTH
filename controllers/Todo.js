const { Router } = require("express");
const Todo = require("../models/Todo");

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


router.get('/findById/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student was not found' });
    }

    res.status(200).json(student);
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