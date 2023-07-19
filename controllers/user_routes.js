const router = require("express").Router();
const { hash } = require("bcrypt");
const User = require("../models/User");


// Log in user
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

        if (!isValidPass) throw new Error("invalid_password");

        // User has been validated and now we log the user in by creating a session
        req.session.user_id = user.id;

        // Give user's firstName so we can say "Welcome, [firstName]!" instead of "Welcome, [email]!"
        req.session.user_id = user.firstName;

        res.redirect("/dashboard");

    } catch(err) {
        if (err.message === "invalid_password") {
            res.redirect("/login");
        }
    }
});

// Register user
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        // Check is username is already registered
        const existingUsername = await User.findOne({
            where: {
                username: username,
            }
        });

        // Check if email is already registered
        const existingEmail = await User.findOne({
            where: {
                email: email,
            }
        });

        // If username or email already registered, return error
        if (existingUsername || existingEmail) {
            return res.render("register", { error: "Username or email already registered. Please try a new username or email, or log in!"});
        }

        // Has password before saving to db
        const hashPassword = await hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashPassword,
        });

        // Creates a session and sends a cookie to the client
        req.session.user_id = newUser.id;

        res.redirect("/dashboard");
    } catch (err) {
        const dupeEmail = err.errors.find(e => e.path === "email");
    
        // If email already exists, redirect to the login page
        if (dupeEmail) res.redirect("/login");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();

    res.redirect("/");
})

module.exports = router;