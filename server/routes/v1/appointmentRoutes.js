const express = require("express");
const router = express.Router();
const Appointment = require("../../models/appointmentModel");
const authMiddleware = require("../../middleware/authMiddleware"); 

// Book an appointment
router.post("/book", authMiddleware(["patient", "admin", "doctor"]), async (req, res) => {
    console.log("req.body",req.body);
    try {
        const { doctorId, patientId, date, time } = req.body;

        // Check if the doctor has already been booked for the given time
        console.log(doctorId, date, time);
        const existingAppointment = await Appointment.findOne({ doctorId, date, time });
        console.log("existingAppointment",existingAppointment);
        if (existingAppointment) {
            return res.status(400).json({ message: "This time slot is already booked." });
        }
        console.log("doctorId",doctorId);
        console.log("patientId",patientId);
        console.log("date",date);
        console.log("time",time);
        // Create and save the appointment
        const appointment = new Appointment({ doctorId, patientId, date, time });
        await appointment.save();
        console.log("appointment",appointment);
        res.status(201).json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
        res.status(500).json({ message: "Error booking appointment", error });
    }
});

// Get appointments for a doctor
router.get("/doctor/:doctorId", authMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.params.doctorId });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error });
    }
});

router.get("/patient/:patientId", authMiddleware(["patient", "admin"]), async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.params.patientId }).populate("doctorId", "fullname areaOfInterest city town");
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching patient appointments:", error);
        res.status(500).json({ message: "Error fetching patient appointments", error });
    }
});

module.exports = router;
