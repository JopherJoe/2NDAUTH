const { Router } = require("express");
const Todo = require("../models/Todo");
const { isLoggedIn } = require("./middleware");

const router = Router();

router.get("/", isLoggedIn, async (req, res) => {
  const { username, email, firstname, lastname } = req.user;

  try {
    const todos = await Todo.find({ email });
    const responseData = {
      email,
      firstname,
      lastname
    };
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "An error occurred while fetching todos" });
  }
});

router.get("/:id", isLoggedIn, async (req, res) => {
  const { username } = req.user;
  const _id = req.params.id;
  res.json(
    await Todo.findOne({ username, _id }).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

router.post("/", isLoggedIn, async (req, res) => {
  const { username } = req.user; 
  req.body.username = username;
  res.json(
    await Todo.create(req.body).catch((error) =>
      res.status(400).json({ error })
    )
  );
});

router.put("/:id", isLoggedIn, async (req, res) => {
  const { username } = req.user;
  req.body.username = username;
  const _id = req.params.id;
  res.json(
    await Todo.updateOne({ username, _id }, req.body, { new: true }).catch(
      (error) => res.status(400).json({ error })
    )
  );
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  const { email } = req.user;
  const _id = req.params.id;
  
  try {
    const result = await Todo.deleteOne({ email, _id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "An error occurred while deleting the todo" });
  }
});


module.exports = router