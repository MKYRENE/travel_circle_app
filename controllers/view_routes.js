const router = require("express").Router();
const User = require("../models/User");
const Thought = require("../models/Thought");

// Custom Middleware
function isAuthenticated(req, res, next) {
    const isAuthenticated = req.session.user_id;

    if (!isAuthenticated) return res.redirect("/");

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
        isLogin: true
    });
});

// Show Register Page
router.get("/register", (req, res) => {
    if (req.session.user_id) return res.redirect("/dashboard");

    res.render("register", {
        isRegister: true
    });
});

// Show About Page
router.get("/about", (req, res) => {
    if (req.session.user_id) return res.redirect("/dashboard");

    res.render("about", {
        isAbout: true
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
        email: user.email,
        thoughts: thoughts
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
        email: user.email,
        thoughts: thoughts
    });
});

module.exports = router;