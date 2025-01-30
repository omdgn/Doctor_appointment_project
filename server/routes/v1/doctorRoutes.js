const express = require("express");
const Doctor = require("../../models/Doctor");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();
// Doctor Registration (Pending Approval)
router.post("/register", authMiddleware(["doctor"]), async (req, res) => {
    try {
        console.log("sago",req)
        const newDoctor = new Doctor({ ...req.body, isApproved: false });
        await newDoctor.save();
        res.json({ message: "Doctor registration submitted for approval" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/status/:userId", authMiddleware(["patient", "admin", "doctor"]), async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.params.userId });

        if (!doctor) return res.status(404).json({ error: "Doctor not found" });

        res.json({
            isApproved: doctor.isApproved,
            fullname: doctor.fullname,
            areaOfInterest: doctor.areaOfInterest,
            availableDays: doctor.availableDays,
            availableHours: doctor.availableHours,
            address: doctor.address,
            city: doctor.city,
            town: doctor.town,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Approved Doctors (For Patients)
router.get("/approved", authMiddleware(["patient"]), async (req, res) => {
    const doctors = await Doctor.find({ isApproved: true });
    res.json(doctors);
});
router.get("/unapproved", authMiddleware(["admin"]), async (req, res) => {
    const doctors = await Doctor.find({ isApproved: false });
    res.json(doctors);
});

module.exports = router;
