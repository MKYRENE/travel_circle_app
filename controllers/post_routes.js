// Import the Express router module to create routes
const router = require("express").Router();

// Import the User and Post models to interact with the database
const User = require("../models/User");
const Post = require("../models/Post");

// Custom Middleware function to check if a user is authenticated
function isAuthenticated(req, res, next) {
    const isAuthenticated = req.session.user_id; // Check if the user session is authenticated

    // If the user is not authenticated, redirect to the login page
    if (!isAuthenticated) return res.redirect("/login");

    // If the user is authenticated, continue to the next middleware or route handler
    next();
}

// Route to handle adding a new post
router.post("/post", isAuthenticated, async (req, res) => {
    // Create a new Post in the database with the provided text and the user ID from the session
    await Post.create({
        text: req.body.text, // Extract the post text from the request body
        userId: req.session.user_id // Set the user ID for the post from the user session
    });

    // After successfully creating the post, redirect the user to the dashboard
    res.redirect("/dashboard");
});

// Export the router to make it accessible from other files
module.exports = router;
