const router = require("express").Router();
const User = require("../models/User");
const Thought = require("../models/Thought");

// Custom Middleware
function isAuthenticated(req, res, next) {
    const isLoggedIn = req.session.user_id;

    if (!isLoggedIn) return res.redirect("/");

    next();
}

// PUBLIC ROUTES
// Show Homepage
router.get("/", async (req, res) => {
    let thoughts = await Thought.findAll({
        include: User
    });

    thoughts = thoughts.map(t => t.get({ plain: true }));

    res.render("index", {
        isHome: true,
        isLoggedIn: req.session.user_id,
    });
});

// Show Login Page
router.get("/login", (req, res) => {
    if (req.session.user_id) return res.redirect("/dashboard");

    res.render("login", {
        isLogin: true,
        isLoggedIn: false, // Adding isLoggedIn as false for non-logged-in users
    });
});

// Show Register Page
router.get("/register", (req, res) => {
    if (req.session.user_id) return res.redirect("/dashboard");

    res.render("register", {
        isRegister: true,
        isLoggedIn: false, // Adding isLoggedIn as false for non-logged-in users
    });
});

// Show About Page
router.get("/about", async (req, res) => {
    // Defines a user to pull email from so that we can display our welcome user message
    const user = await User.findByPk(req.session.user_id)

    res.render("about", {
        isAbout: true,
        isLoggedIn: req.session.user_id ? true : false, // Works whether user is logged in or not
        email: user ? user.email : null, // If user exists, return user.email, else return null
    });
});

// PRIVATE ROUTES
// Show Feed Page
router.get("/feed", isAuthenticated, async (req, res) => {

    const user = await User.findByPk(req.session.user_id, {
        include: Thought
    });

    const thoughts = user.thoughts.map(t => t.get({ plain: true }));

    // The user IS logged in
    res.render("feed", {
        isFeed: true,
        isLoggedIn: true, // Adding isLoggedIn as true for logged-in users
        email: user.email,
        thoughts: thoughts,
    });
});

// Show Dashboard Page
router.get("/dashboard", isAuthenticated, async (req, res) => {

    const user = await User.findByPk(req.session.user_id, {
        include: Thought
    });

    const thoughts = user.thoughts.map(t => t.get({ plain: true }));

    // The user IS logged in
    res.render("dashboard", {
        isDashboard: true,
        isLoggedIn: true, // Adding isLoggedIn as true for logged-in users
        email: user.email,
        thoughts: thoughts,
    });
});

module.exports = router;
