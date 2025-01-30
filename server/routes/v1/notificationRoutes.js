const express = require("express");
const { sendEmail } = require("../../services/emailService");
const router = express.Router();

// Route to send notifications
router.post("/send", async (req, res) => {
    const { to, subject, text, html } = req.body;

    try {
        await sendEmail(to, subject, text, html);
        res.status(200).json({ message: "Notification sent successfully!" });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ error: "Failed to send notification." });
    }
});

module.exports = router;
