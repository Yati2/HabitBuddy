const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 8000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

const uri = "mongodb+srv://fayazlol:8Of6YLHdLFtjM0Zz@wad2.tf2ub.mongodb.net/?retryWrites=true&w=majority&appName=wad2";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema, "users");

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connection to MongoDB is successful");
    } catch (error) {
        console.log("MongoDB connection error:", error);
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
    const { username, email, password } = req.body; // Now req.body should be defined
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
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        // Check if the password matches
        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        // If successful, return a success message
        res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
