const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../../models/User");

// Store role in session before redirecting to Google OAuth
router.get("/google/doctor", (req, res, next) => {
    req.session.role = "doctor";
    next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/patient", (req, res, next) => {
    req.session.role = "patient";
    next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log("ttttt",`http://localhost:3001?token=${token}?id=${req.user.googleId}`)
    res.redirect(`http://localhost:3001?token=${token}&id=${req.user.googleId}`); // Redirect to frontend with token
});

router.post("/admin/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("email",email, password)
        const admin = await User.findOne({ email, role: "admin" }); // Ensure only admin can log in
        console.log("admin",admin, password, admin.password)
        if (!admin) return res.status(404).json({ error: "Admin not found" });

        // Directly compare passwords (Since admin passwords are not hashed)
        if (password !== admin.password) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, role: admin.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
