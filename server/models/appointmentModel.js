const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    doctorId: { type: String, ref: "Doctor", required: true },
    patientId: { type: String, ref: "User", required: true },
    date: { type: String, required: true },  // Format: "Monday, 2025-02-01"
    time: { type: String, required: true }   // Format: "08:30 AM"
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
