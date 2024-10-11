const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000; // Use environment variable or default to 8000

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

const uri = "mongodb+srv://fayazlol:8Of6YLHdLFtjM0Zz@wad2.tf2ub.mongodb.net/?retryWrites=true&w=majority&appName=wad2";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Ensure unique usernames
    email: { type: String, required: true },
    password: { type: String, required: true }
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
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
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
        res.status(201).json({ message: "Post created successfully!", post: newPost });
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

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
