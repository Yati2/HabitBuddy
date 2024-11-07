const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000; // Use environment variable or default to 8000

app.use(
    cors({
        origin: "*", // Allow all origins
        methods: ["GET", "POST", "PUT", "DELETE"], // Explicitly allow DELETE
    })
);
app.use(express.json()); // Parse JSON bodies

const uri =
    "mongodb+srv://fayazlol:8Of6YLHdLFtjM0Zz@wad2.tf2ub.mongodb.net/?retryWrites=true&w=majority&appName=wad2";

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

//Start of Shop Related

//just keeping this in for now, but as of 23 oct all shop items are stored under data in the vue instance in a list. easier that way.
const shopSchema = new mongoose.Schema({
    itemname: { type: String, required: true },
    itemtype: { type: String, required: true },
    itemdesc: { type: String, required: true },
    fishnourishment: { type: Number, required: true },
    imgpath: { type: String, required: true },
    cost: { type: Number, required: true },
});

const Shop = mongoose.model("Shop", shopSchema, "shop");

//fetch all shop items (depreciated)
app.get("/api/shop", async (req, res) => {
    try {
        const shopitems = await Shop.find();
        console.log("Fetched shop items:", shopitems);
        res.json(shopitems);
    } catch (error) {
        console.error("Error fetching shopitems:", error);
        res.status(500).send("Error fetching shopitems");
    }
});

app.get("/api/users/:username/points", async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user's points
        res.status(200).json({ points: user.points });
    } catch (error) {
        console.error("Error fetching points:", error);
        res.status(500).json({ message: "Error fetching user points" });
    }
});

//for purchase and deducting points
app.put("/api/users/:username/deduct-points", async (req, res) => {
    const { username } = req.params;
    const { pointsToDeduct } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { username },
            { $inc: { points: -pointsToDeduct } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Points deducted successfully",
            points: user.points,
        });
    } catch (error) {
        res.status(500).json({ message: "Error deducting points", error });
    }
});

//End of Shop Related

//Start of Inventory Related
const inventorySchema = new mongoose.Schema({
    username: { type: String, required: true },
    itemname: { type: String, required: true },
    itemtype: { type: String, required: true },
    itemdesc: { type: String, required: true },
    itemqty: { type: Number, required: true },
    imgpath: { type: String, required: true },
    applied: { type: Boolean, default: false },
});

const Inventory = mongoose.model("Inventory", inventorySchema, "userinventory");

app.get("/api/userinventory/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const inventory = await Inventory.find({ username: username });
        res.json(inventory);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).send("Error fetching inventory");
    }
});

app.put("/api/userinventory/apply", async (req, res) => {
    const { username, itemname, itemtype } = req.body;

    try {
        console.log(req.body);
        await Inventory.updateMany({ username, itemtype }, { applied: false });
        console.log("Item applied:", itemname);

        await Inventory.updateOne({ username, itemname }, { applied: true });

        res.status(200).json({ message: "Item applied successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error applying item" });
    }
});

app.put("/api/inventory/update", async (req, res) => {
    const { username, itemname, itemqty } = req.body;

    try {
 
        const updatedItem = await Inventory.findOneAndUpdate(
            { username: username, itemname: itemname },
            { itemqty: itemqty },
            { new: true } 
        );


        if (!updatedItem) {
            return res
                .status(404)
                .json({ message: "Item not found in inventory" });
        }

        res.status(200).json({
            message: "Item quantity updated successfully",
            item: updatedItem,
        });
    } catch (error) {
        console.error("Error updating inventory:", error);
        res.status(500).json({ message: "Error updating inventory", error });
    }
});

app.post("/api/inventory/add", async (req, res) => {
    const {
        username,
        itemname,
        itemtype,
        itemdesc,
        itemqty,
        imgpath,
        applied,
    } = req.body;

    try {
        const existingItem = await Inventory.findOne({
            username: username,
            itemname: itemname,
        });

        if (existingItem) {
            existingItem.itemqty += itemqty;
            await existingItem.save();
            res.status(200).json({
                message: "Item quantity updated successfully",
            });
        } else {
            const newItemData = {
                username: username,
                itemname: itemname,
                itemtype: itemtype,
                itemdesc: itemdesc,
                itemqty: itemqty,
                imgpath: imgpath,
            };

            if (itemtype !== "fish") {
                newItemData.applied = applied || false;
            }

            const newItem = new Inventory(newItemData);
            await newItem.save();

            res.status(201).json({ message: "New item added to inventory" });
        }
    } catch (error) {
        console.error("Error updating inventory:", error);
        res.status(500).json({ message: "Error updating inventory", error });
    }
});

app.put("/api/inventory/decrease", async (req, res) => {
    const { username, itemname, decreaseBy } = req.body;
    console.log("Endpoint hit with data:", req.body);
    try {
        const item = await Inventory.findOne({
            username: username,
            itemname: itemname,
        });

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        item.itemqty = Math.max(item.itemqty - decreaseBy, 0);
        await item.save();

        res.status(200).json({
            message: "Item quantity decreased successfully",
            item,
        });
    } catch (error) {
        console.error("Error decreasing item quantity:", error);
        res.status(500).json({
            message: "Error decreasing item quantity",
            error,
        });
    }
});

//End of Inventory Related

//User
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Ensure unique usernames
    email: { type: String, required: true },
    password: { type: String, required: true },
    points: { type: Number, required: true },
    habitcompleted: { type: Number, required: true },
    longtermcompleted: { type: Number, required: true },
    todocompleted: { type: Number, required: true },
    bgImage: {
        type: String,
        default: "./src/assets/profile/profilebackgrounds/background1.webp",
    },
    avatarImage: {
        type: String,
        default: "/src/assets/profile/profilepics/pfp1.jpeg",
    },
    habitLog: {type: Object, required: false},
    longtermLog: {type: Object, required: false},
    todoLog: {type: Object, required: false},
});

const User = mongoose.model("User", userSchema, "users");

app.put("/api/users/:username/points", async (req, res) => {
    const { username } = req.params; // Get the username from the URL
    const { pointsToAdd } = req.body; // Get the points to add from the request body

    try {
        // Increment the points for the user by the given amount
        const updatedUser = await User.findOneAndUpdate(
            { username: username }, // Find user by username
            { $inc: { points: pointsToAdd } }, // Increment points field by pointsToAdd
            { new: true } // Return the updated user document
        );

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.json(updatedUser); // Send the updated user data back
    } catch (error) {
        console.error("Error updating points:", error);
        res.status(500).send("Error updating points");
    }
});

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
    const {
        username,
        email,
        password,
        points,
        habitcompleted,
        todocompleted,
        longtermcompleted,
        habitLog,
        longtermLog,
        todoLog,
    } = req.body;
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Username already exists." });
        }

        // Create a new user
        const newUser = new User({
            username,
            email,
            password,
            points,
            habitcompleted,
            todocompleted,
            longtermcompleted,
            habitLog,
            longtermLog,
            todoLog,
        });
        await newUser.save();

        const newPet = new Pet({
            username,
            petName: "orange",
            happinessLevel: 100,
        });
        await newPet.save();
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
            return res
                .status(400)
                .json({ message: "Invalid username or password." });
        }

        // Check if the password matches (consider hashing in production)
        if (user.password !== password) {
            return res
                .status(400)
                .json({ message: "Invalid username or password." });
        }

        res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});
//delete all the related data when deleting a user
app.delete("/api/users/:username", async (req, res) => {
    const { username } = req.params;
    console.log(username);

    try {
        // Delete the user
        const user = await User.findOneAndDelete({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete related data from other schemas and log the number of deleted documents
        const [
            deletedPosts,
            deletedTodos,
            deletedHabits,
            deletedJournals,
            deletedLTs,
            deletedPets,
        ] = await Promise.all([
            Post.deleteMany({ username: username }), // Delete related posts
            ToDo.deleteMany({ username: username }), // Delete related todos
            Habit.deleteMany({ username: username }), // Delete related habits
            Journal.deleteMany({ username: username }), // Delete related journals
            LT.deleteMany({ username: username }), // Delete related LTs
            Pet.deleteMany({ username: username }), // Delete related pets
        ]);

        console.log(`Deleted ${deletedPosts.deletedCount} posts`);
        console.log(`Deleted ${deletedTodos.deletedCount} todos`);
        console.log(`Deleted ${deletedHabits.deletedCount} habits`);
        console.log(`Deleted ${deletedJournals.deletedCount} journals`);
        console.log(`Deleted ${deletedLTs.deletedCount} LTs`);
        console.log(`Deleted ${deletedPets.deletedCount} pets`);

        res.status(200).json({
            message: "User and related data deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting user and related data:", error);
        res.status(500).json({
            message: "Error deleting user and related data",
        });
    }
});

//profile
// update background image and avatar
app.put("/api/users/:username/images", (req, res) => {
    const { bgImage, avatarImage } = req.body;
    User.findOneAndUpdate(
        { username: req.params.username },
        { bgImage, avatarImage },
        { new: true }
    )
        .then((updatedUser) => res.json(updatedUser))
        .catch((err) => res.status(400).json("Error: " + err));
});

//Forum
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
    topic: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema, "posts");

// Create new post
app.post("/api/posts", async (req, res) => {
    console.log("Request Body:", req.body);
    const { content, username, topic } = req.body; // Include topic in the request body

    // Validate that the topic field is provided
    if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
    }

    try {
        const newPost = new Post({
            content,
            username,
            topic, // Store the topic in the post
            likes: 0,
            comments: [],
        });
        await newPost.save();
        res.status(201).json({
            message: "Post created successfully!",
            post: newPost,
        });
        console.log("New Post:", newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Error creating post" });
    }
});

// Fetch posts by topic
app.get("/api/posts", async (req, res) => {
    const { topic } = req.query; // Get the topic from the query string

    try {
        const query = topic ? { topic } : {}; // If topic is provided, filter posts by topic
        const posts = await Post.find(query).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Error fetching posts");
    }
});

// Delete post by ID
app.delete("/api/posts/:id", async (req, res) => {
    const postId = req.params.id; // Get the post ID from the request parameters

    try {
        const deletedPost = await Post.findByIdAndDelete(postId); // Find and delete the post by ID

        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" }); // If no post is found, send a 404 error
        }

        res.status(200).json({
            message: "Post deleted successfully",
            post: deletedPost,
        }); // Respond with a success message
    } catch (error) {
        console.error("Error deleting post:", error); // Log any error
        res.status(500).json({ message: "Error deleting post" }); // Respond with a 500 error if something goes wrong
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

//tasks api endpoints

const habitSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: String, required: true },
    username: { type: String, required: true },
    count: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Habit = mongoose.model("Habit", habitSchema);

//update todocompleted
app.put("/api/users/:username/todocompleted", async (req, res) => {
    const { username } = req.params;
    const { incrementBy } = req.body; // The value by which to increment todocompleted (e.g., 1)

    try {
        // Find the user by username and increment todocompleted
        const user = await User.findOneAndUpdate(
            { username: username },
            { $inc: { todocompleted: incrementBy } }, // Use $inc operator to increment
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "todo completed count incremented", user });
    } catch (error) {
        console.error("Error updating todocompleted:", error);
        res.status(500).json({ message: "Error updating todocompleted" });
    }
});

//update longtermcompleted
app.put("/api/users/:username/longtermcompleted", async (req, res) => {
    const { username } = req.params;
    const { incrementBy } = req.body; // The value by which to increment habitCompleted (e.g., 1)

    try {
        // Find the user by username and increment habitCompleted
        const user = await User.findOneAndUpdate(
            { username: username },
            { $inc: { longtermcompleted: incrementBy } }, // Use $inc operator to increment
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "longterm completed count incremented", user });
    } catch (error) {
        console.error("Error updating longterm:", error);
        res.status(500).json({ message: "Error updating longtermcompleted" });
    }
});

// Update habitCompleted field
app.put("/api/users/:username/habitcompleted", async (req, res) => {
    const { username } = req.params;
    const { incrementBy } = req.body; // The value by which to increment habitCompleted (e.g., 1)

    try {
        // Find the user by username and increment habitCompleted
        const user = await User.findOneAndUpdate(
            { username: username },
            { $inc: { habitcompleted: incrementBy } }, // Use $inc operator to increment
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Habit completed count incremented", user });
    } catch (error) {
        console.error("Error updating habitCompleted:", error);
        res.status(500).json({ message: "Error updating habitCompleted" });
    }
});

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
        res.status(201).json({
            message: "Habit created successfully",
            habit: savedHabit,
        });
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
        res.status(201).json({
            message: "LT created successfully",
            lt: savedLT,
        });
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
        res.status(201).json({
            message: "To-Do created successfully",
            todo: savedToDo,
        });
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

// retrieve journal entries by month and year
app.get("/api/journals/:username/:year/:month", async (req, res) => {
    const { username, year, month } = req.params;

    if (!username || !year || !month) {
        return res
            .status(400)
            .json({ message: "Username, year, and month are required" });
    }

    try {
        // Create a date range for the specified month
        const startDate = new Date(year, month - 1, 1); // month is 0-indexed
        const endDate = new Date(year, month, 1); // the start of the next month

        const journalEntries = await Journal.find({
            username,
            date: { $gte: startDate, $lt: endDate },
        });

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

//Pet
// Pet Schema
const petSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Link to user by username
    petName: { type: String, default: "Bluey" }, // Default pet name
    happinessLevel: { type: Number, default: 100 },
    type: { type: String, default: "yellow" },
    accessory: { type: Boolean, default: false },
    bg: { type: String, default: "cozy_room" }, // Happiness level (0-100)
});

// Create the Pet model
const Pet = mongoose.model("Pet", petSchema);

// Fetch pet data by username
app.get("/api/pet/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const pet = await Pet.findOne({ username });
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        res.json(pet);
    } catch (error) {
        console.error("Error fetching pet data:", error);
        res.status(500).json({ message: "Error fetching pet data" });
    }
});

// Update pet data (e.g., petName, happinessLevel)
app.put("/api/pet/:username", async (req, res) => {
    const { username } = req.params;
    const { petName, happinessLevel } = req.body; // Only update these fields

    try {
        const updatedPet = await Pet.findOneAndUpdate(
            { username },
            { petName, happinessLevel },
            { new: true } // Return the updated pet document
        );

        if (!updatedPet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        res.json(updatedPet);
    } catch (error) {
        console.error("Error updating pet data:", error);
        res.status(500).json({ message: "Error updating pet data" });
    }
});

//profile page api

app.get("/api/users/:username", async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.json(user);
});

app.put("/api/users/:username/password", async (req, res) => {
    const { username } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOneAndUpdate({ username }, { password });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send("Password updated successfully");
    } catch (error) {
        res.status(500).send("Error updating password");
    }
});
