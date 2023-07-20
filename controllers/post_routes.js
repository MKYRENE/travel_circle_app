const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

function isAuthenticated(req, res, next) {
    const isAuthenticated = req.session.user_id;
    if (!isAuthenticated) return res.redirect("/login");
    
    next();
}

router.post("/post", isAuthenticated, async (req, res) => {
    try {
        const { text, date, city } = req.body;

        // Create a new Post in the database with the provided text, date, city, and the user ID from the session
        await Post.create({
            text: req.body.text,
            date: req.body.date,
            city: req.body.city,
            userId: req.session.user_id,
        });

        req.session.dashboardData = { date, city, text };

        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("An error occurred while creating the post.");
    }
});

module.exports = router;
