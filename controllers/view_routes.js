const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

// Custom Middleware
function isAuthenticated(req, res, next) {
    const isLoggedIn = req.session.user_id;

    if (!isLoggedIn) return res.redirect("/");

    next();
}

// PUBLIC ROUTES
// Show Homepage
router.get("/", async (req, res) => {
    const user_id = req.session.user_id
    let posts = await Post.findAll({
        include: User
    });

    posts = posts.map(t => t.get({ plain: true }));
    let user;
    if (user_id) {
        user = await User.findByPk(user_id)
        console.log(user)
    }

    res.render("index", {
        isHome: true,
        isLoggedIn: user_id,
        firstName:user?.firstName
        // isLoggedIn: req.session.user_id,
        // posts: posts
    });
});

// Show Login Page
router.get("/login", (req, res) => {
    if (req.session.user_id) return res.redirect("/dashboard");

    res.render("login", {
        isLoginOrRegister: true,
        isLoggedIn: false, // Adding isLoggedIn as false for non-logged-in users
    });
});

// Show Register Page
router.get("/register", (req, res) => {
    if (req.session.user_id) return res.redirect("/dashboard");

    res.render("register", {
        isLoginOrRegister: true,
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
        firstName: user ? user.firstName : null, // If user, return user.firstName, else null
    });
});

// PRIVATE ROUTES
// Show Feed Page
router.get("/feed", isAuthenticated, async (req, res) => {

    const user = await User.findByPk(req.session.user_id, {
        include: Post
    });

    const posts = user.posts.map(t => t.get({ plain: true }));

    // The user IS logged in
    res.render("feed", {
        isFeed: true,
        isLoggedIn: true, // Adding isLoggedIn as true for logged-in users
        email: user.email,
        firstName: user.firstName,
        username: user.username,       
        posts: posts,
    });
});

// Show Dashboard Page
router.get("/dashboard", isAuthenticated, async (req, res) => {

    const user = await User.findByPk(req.session.user_id, {
        include: Post
    });

    const posts = user.posts.map(t => t.get({ plain: true }));
    const { date, city, text } = req.session.dashboardData || {};

    // The user IS logged in
    res.render("dashboard", {
        isDashboard: true,
        isLoggedIn: true, // Adding isLoggedIn as true for logged-in users
        email: user.email,
        firstName: user.firstName,
        date,
        city,
        text
    });
});

module.exports = router;