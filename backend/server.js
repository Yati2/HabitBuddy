const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000; // Use environment variable or default to 8000

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

const uri =
  "mongodb+srv://fayazlol:8Of6YLHdLFtjM0Zz@wad2.tf2ub.mongodb.net/?retryWrites=true&w=majority&appName=wad2";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Ensure unique usernames
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema, "users");

// Post Schema
const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  username: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [
    {
      username: { type: String, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema, "posts");

// Connect to MongoDB
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connection to MongoDB is successful");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connect();

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    console.log("Fetched users:", users);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // Check if the password matches (consider hashing in production)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Create new post
app.post("/api/posts", async (req, res) => {
  const { content, username } = req.body;
  try {
    const newPost = new Post({ content, username, likes: 0, comments: [] });
    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post" });
  }
});

// Fetch all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Error fetching posts");
  }
});

// Like post
app.post("/api/posts/:id/like", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (post) {
      post.likes += 1;
      await post.save();
      res.json({ message: "Post liked successfully!", post });
    } else {
      res.status(404).json({ message: "Post not found." });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Error liking post" });
  }
});

// Comment on post
app.post("/api/posts/:id/comment", async (req, res) => {
  const postId = req.params.id;
  const { username, comment } = req.body;
  try {
    const post = await Post.findById(postId);
    if (post) {
      post.comments.push({ username, comment });
      await post.save();
      res.json({ message: "Comment added successfully!", post });
    } else {
      res.status(404).json({ message: "Post not found." });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
});

const habitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: String, required: true },
  username: { type: String, required: true },
  count: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Habit = mongoose.model("Habit", habitSchema);

app.delete("/api/user_habits", async (req, res) => {
  const { username, title, id } = req.query; // Extract username, title, and id from query parameters

  try {
    // Query MongoDB to delete the todo with the given username, title, and _id
    const result = await Habit.deleteOne({
      _id: id,
      username: username,
      title: title,
    });

    // Check if the todo was successfully deleted
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Habit successfully deleted" });
    } else {
      res.status(404).json({ message: "Habit not found" });
    }
  } catch (error) {
    console.error("Error deleting Habit:", error);
    res.status(500).send("Error deleting Habit");
  }
});

app.get("/api/user_habits", async (req, res) => {
  const { username } = req.query; // Get the username from the query parameter

  try {
    const habits = await Habit.find({ username: username }); // Query MongoDB for todos matching the username
    res.json(habits); // Send the todos back to the client
  } catch (error) {
    console.error("Error fetching habits:", error);
    res.status(500).send("Error fetching habits");
  }
});

// POST endpoint for creating a new To-Do
app.post("/api/habits", async (req, res) => {
  const { title, description, tags, count } = req.body;
  const username = req.body.username || "anonymous"; // Optional username, default to anonymous

  // Validate request
  if (!title || !description || !tags) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Create a new To-Do entry
  const newHabit = new Habit({
    title,
    description,
    tags,
    count,
    username,
  });

  try {
    const savedHabit = await newHabit.save();
    res
      .status(201)
      .json({ message: "Habit created successfully", habit: savedHabit });
  } catch (error) {
    console.error("Error saving Habit:", error);
    res.status(500).json({ message: "Error creating Habit" });
  }
});

app.put("/api/habits/:id", async (req, res) => {
  const { id } = req.params;
  const { count } = req.body;

  try {
    const habit = await Habit.findByIdAndUpdate(
      id,
      { count: count },
      { new: true }
    );
    res.json(habit);
  } catch (error) {
    console.error("Error updating count:", error);
    res.status(500).send("Error updating count");
  }
});

const lthSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: String, required: true },
  username: { type: String, required: true },
  duedate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const LT = mongoose.model("LT", lthSchema);

app.delete("/api/user_lts", async (req, res) => {
  const { username, title, id } = req.query; // Extract username, title, and id from query parameters

  try {
    // Query MongoDB to delete the todo with the given username, title, and _id
    const result = await LT.deleteOne({
      _id: id,
      username: username,
      title: title,
    });

    // Check if the todo was successfully deleted
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "LT successfully deleted" });
    } else {
      res.status(404).json({ message: "LT not found" });
    }
  } catch (error) {
    console.error("Error deleting LT:", error);
    res.status(500).send("Error deleting LT");
  }
});

app.get("/api/user_lts", async (req, res) => {
  const { username } = req.query; // Get the username from the query parameter

  try {
    const lts = await LT.find({ username: username }); // Query MongoDB for todos matching the username
    res.json(lts); // Send the todos back to the client
  } catch (error) {
    console.error("Error fetching lts:", error);
    res.status(500).send("Error fetching lts");
  }
});

// POST endpoint for creating a new To-Do
app.post("/api/lts", async (req, res) => {
  const { title, description, tags, duedate } = req.body;
  const username = req.body.username || "anonymous"; // Optional username, default to anonymous

  // Validate request
  if (!title || !description || !tags) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Create a new To-Do entry
  const newLT = new LT({
    title,
    description,
    tags,
    duedate,
    username,
  });

  try {
    const savedLT = await newLT.save();
    res.status(201).json({ message: "LT created successfully", lt: savedLT });
  } catch (error) {
    console.error("Error saving LT:", error);
    res.status(500).json({ message: "Error creating LT" });
  }
});

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: String, required: true },
  username: { type: String, required: true }, // Assuming you are saving the to-dos per user
  createdAt: { type: Date, default: Date.now },
});

// Create To-Do Model
const ToDo = mongoose.model("ToDo", todoSchema);

app.delete("/api/user_todos", async (req, res) => {
  const { username, title, id } = req.query; // Extract username, title, and id from query parameters

  try {
    // Query MongoDB to delete the todo with the given username, title, and _id
    const result = await ToDo.deleteOne({
      _id: id,
      username: username,
      title: title,
    });

    // Check if the todo was successfully deleted
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Todo successfully deleted" });
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).send("Error deleting todo");
  }
});

app.get("/api/user_todos", async (req, res) => {
  const { username } = req.query; // Get the username from the query parameter

  try {
    const todos = await ToDo.find({ username: username }); // Query MongoDB for todos matching the username
    res.json(todos); // Send the todos back to the client
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).send("Error fetching todos");
  }
});

// POST endpoint for creating a new To-Do
app.post("/api/todos", async (req, res) => {
  const { title, description, tags } = req.body;
  const username = req.body.username || "anonymous"; // Optional username, default to anonymous

  // Validate request
  if (!title || !description || !tags) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Create a new To-Do entry
  const newToDo = new ToDo({
    title,
    description,
    tags,
    username,
  });

  try {
    const savedToDo = await newToDo.save();
    res
      .status(201)
      .json({ message: "To-Do created successfully", todo: savedToDo });
  } catch (error) {
    console.error("Error saving To-Do:", error);
    res.status(500).json({ message: "Error creating To-Do" });
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

//Journal
// Journal Schema
const journalSchema = new mongoose.Schema({
  username: { type: String, required: true },
  date: { type: Date, required: true },
  entry: { type: String, required: true },
  mood: { type: String, required: true },
});

const Journal = mongoose.model("Journal", journalSchema);

//getAllJournal
app.get("/api/journals", async (req, res) => {
  try {
    const journals = await Journal.find();
    console.log("Fetched journals:", Journal);
    res.json(journals);
  } catch (error) {
    console.error("Error fetching journals:", error);
    res.status(500).send("Error fetching journals");
  }
});

// create journal entry
app.post("/api/journals", async (req, res) => {
  const { username, date, entry, mood } = req.body;
  console.log(username, date, entry, mood);

  if (!username || !date || !entry || !mood) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newJournalEntry = new Journal({
      username,
      date,
      entry,
      mood,
    });
    const savedJournalEntry = await newJournalEntry.save();
    res.status(201).json({
      message: "Journal entry created successfully",
      journal: savedJournalEntry,
    });
  } catch (error) {
    console.error("Error saving journal entry:", error);
    res.status(500).json({ message: "Error creating journal entry" });
  }
});

// retrieve journal entry for users
app.get("/api/journals/:username", async (req, res) => {
  const { username } = req.params;

  console.log("Fetching journal entries for username:", username); // Debug log

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const journalEntries = await Journal.find({ username }); // Check if this matches the schema
    res.json(journalEntries);
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    res.status(500).json({ message: "Error fetching journal entries" });
  }
});

// update journal entry
app.put("/api/journals/:id", async (req, res) => {
  const { id } = req.params;
  const { entry, mood } = req.body;

  try {
    const updatedJournalEntry = await Journal.findByIdAndUpdate(
      id,
      { entry, mood },
      { new: true }
    );
    res.json({
      message: "Journal entry updated",
      journal: updatedJournalEntry,
    });
  } catch (error) {
    console.error("Error updating journal entry:", error);
    res.status(500).json({ message: "Error updating journal entry" });
  }
});

// delete journal entry
app.delete("/api/journals/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Journal.findByIdAndDelete(id);
    res.json({ message: "Journal entry deleted" });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    res.status(500).json({ message: "Error deleting journal entry" });
  }
});
