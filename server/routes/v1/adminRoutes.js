const express = require("express");
const Doctor = require("../../models/Doctor");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

// ✅ Ensure only admins can approve doctors
router.put("/approve/:doctorId", authMiddleware(["admin"]), async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.doctorId, { isApproved: true }, { new: true });
        if (!doctor) return res.status(404).json({ error: "Doctor not found" });

        res.json({ message: "Doctor approved", doctor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
