// Import the Express router module to create routes
const router = require("express").Router();

// Import the bcrypt library for password hashing
const { hash } = require("bcrypt");

// Import the User model to interact with the database
const User = require("../models/User");

// Route to handle user login
router.post("/login", async (req, res) => {
    try {
        // Check if the user is already logged in; if so, redirect to the dashboard
        if (req.session.user_id) {
            return res.redirect("/dashboard");
        }

        // Extract the username and password from the request body
        const formUsername = req.body.username;
        const formPassword = req.body.password;

        // Find the user in the database by their username
        const user = await User.findOne({
            where: {
                username: formUsername
            }
        });

        // If the user doesn't exist, redirect to the registration page
        if (!user) return res.redirect("/register");

        // Validate that the provided password matches the user's hashed password
        const isValidPass = await user.validatePass(formPassword)

        // If the password is invalid, throw an error with a custom message
        if (!isValidPass) throw new Error("invalid_password");

        // If the user is valid, create a session and log the user in
        req.session.user_id = user.id;
        req.session.user_firstName = user.firstName;

        // Redirect the user to the dashboard after successful login
        res.redirect("/dashboard");

    } catch (err) {
        // If there's an error due to an invalid password, redirect to the login page
        if (err.message === "invalid_password") {
            res.redirect("/login");
        }
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

        // If the username or email is already registered, return an error
        if (existingUsername || existingEmail) {
            return res.render("register", { error: "Username or email already registered. Please try a new username or email, or log in!" });
        }

        // Hash the password before saving it to the database
        const hashPassword = await hash(password, 10);

        // Create a new user in the database with the provided details
        const newUser = await User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashPassword,
        });

        // Create a session and send a cookie to the client after successful registration
        req.session.user_id = newUser.id;

        // Redirect the user to the dashboard after successful registration
        res.redirect("/dashboard");
    } catch (err) {
        // Check if the error is due to a duplicate email
        const dupeEmail = err.errors.find(e => e.path === "email");

        // If the email already exists, redirect to the login page
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
