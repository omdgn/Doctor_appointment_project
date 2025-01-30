const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function loginUser(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    // Directly compare passwords (since no hashing)
    if (password !== user.password) {
        throw new Error("Invalid credentials");
    }

    // Generate JWT Token
    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { token, role: user.role };
}

module.exports = { loginUser };
