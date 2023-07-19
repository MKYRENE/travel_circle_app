// Import the Express router module to create routes
const router = require("express").Router();

// Import the bcrypt library for password hashing
const { hash } = require("bcrypt");

// Import the User model to interact with the database
const User = require("../models/User");

// Route to handle user login
router.post("/login", async (req, res) => {
    try {

        if (req.session.user_id) {
            return res.redirect("/dashboard");
        }
        const formUsername = req.body.username;
        const formPassword = req.body.password;

        const user = await User.findOne({
            where: {
                username: formUsername
            }
        });

        // If user doesn't exist, break the process with return and then redirect to /register
        if (!user) return res.redirect("/register");

        // Validate that the password is a match

        const isValidPass = await user.validatePass(formPassword)

        if (!isValidPass) {
            console.log('invalid pass')
            // Password is invalid, render login view with an error message
            return res.render("login", {
                isLoginOrRegister: true,
                isLoggedIn: false,
                error: "Invalid password. Please try again.",
            });
        }
        console.log('6')

        // If the user is valid, create a session and log the user in
        req.session.user_id = user.id;
        req.session.user_firstName = user.firstName;
        console.log('7')
        res.redirect("/dashboard");

    } catch (err) {
        console.error(err)
        res.redirect("/login");
    }
});

// Route to handle user registration
router.post("/register", async (req, res) => {
    try {
        // Extract user details from the request body
        const { firstName, lastName, username, email, password } = req.body;

        // Check if the username is already registered
        const existingUsername = await User.findOne({
            where: {
                username: username,
            }
        });

        // Check if the email is already registered
        const existingEmail = await User.findOne({
            where: {
                email: email,
            }
        });

        // If username already registered, return error
        if (existingUsername) {
            return res.render("register", { error: "That username is taken! Please log in if you have an account, or register with a different username." });
        }

        // If email already registered, return error
        if (existingEmail) {
            return res.render("register", { error: "That email is taken! Please log in if you have an account, or register with a different email." });
        }

        // Create a new user in the database with the provided details
        const newUser = await User.create({
            firstName,
            lastName,
            username,
            email,
            password,
        });

        // Create a session and send a cookie to the client after successful registration
        req.session.user_id = newUser.id;

        // Redirect the user to the dashboard after successful registration
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        const dupeEmail = err.errors.find(e => e.path === "email");

        // If email already exists, redirect to the login page
        if (dupeEmail) res.redirect("/login");
    }
});

// Route to handle user logout
router.get("/logout", (req, res) => {
    // Destroy the session and log the user out
    req.session.destroy();

    // Redirect the user to the homepage after successful logout
    res.redirect("/");
});

// Export the router to make it accessible from other files
module.exports = router;
