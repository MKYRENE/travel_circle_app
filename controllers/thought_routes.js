const router = require("express").Router();
const User = require("../models/User");
const Thought = require("../models/Thought");

// Custom Middleware
function isAuthenticated(req, res, next) {
    const isAuthenticated = req.session.user_id;

    if (!isAuthenticated) return res.redirect("/login");

    next();
}

// Add a thought
router.post("/thought", isAuthenticated, async (req, res) => {
    await Thought.create({
        text: req.body.text,
        userId: req.session.user_id
    });

    res.redirect("/dashboard");
});

module.exports = router;