const router = require("express").Router();
const User = require("../models/User");


// Log in user
router.post("/login", async (req, res) => {
    try {
        const formEmail = req.body.email;
        const formPassword = req.body.password;

        const user = await User.findOne({
            where: {
                email: formEmail
            }
        });

        // If user doesn't exist, break the process with return and then redirect to /register
        if (!user) return res.redirect("/register");

        // Validate that the password is a match
        const isValidPass = await user.validatePass(formPassword)

        if (!isValidPass) throw new Error("invalid_password");

        // User has been validated and now we log the user in by creating a session
        req.session.user_id = user.id;

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
        const newUser = await User.create(req.body);

        // Creates a session and sends a cookie to the client
        req.session_user_id = newUser.id;

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