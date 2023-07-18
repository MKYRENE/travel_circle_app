const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

// Custom Middleware
function isAuthenticated(req, res, next) {
    const isAuthenticated = req.session.user_id;

    if (!isAuthenticated) return res.redirect("/login");

    next();
}

// Add a post
router.post("/post", isAuthenticated, async (req, res) => {
    await Post.create({
        text: req.body.text,
        userId: req.session.user_id
    });

    res.redirect("/dashboard");
});

module.exports = router;