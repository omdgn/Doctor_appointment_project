const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    role: { type: String, enum: ["doctor", "patient", "admin"], required: true },
    password: { type: String, required: false },
});

module.exports = mongoose.model("User", UserSchema);
