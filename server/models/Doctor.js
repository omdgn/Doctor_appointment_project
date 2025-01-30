const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
    userId: { type: String, ref: "User", required: true, unique: true },
    fullname: { type: String, required: true },
    areaOfInterest: { type: [String], required: true },
    availableDays: { type: [String], required: true },
    availableHours: { from: String, to: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    town: { type: String, required: true },
    isApproved: { type: Boolean, default: false }
});

module.exports = mongoose.model("Doctor", DoctorSchema);
