require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");

const { publishToQueue } = require("./services/rabbitmqPublisher");
const { consumeQueue } = require("./services/rabbitmqConsumer");
const { sendEmail } = require("./services/emailService");

const cron = require("node-cron"); // For scheduling

require("./config/passportSetup");

const authRoutes = require("./routes/v1/authRoutes");
const doctorRoutes = require("./routes/v1/doctorRoutes");
const adminRoutes = require("./routes/v1/adminRoutes");
const appointmentRoutes = require("./routes/v1/appointmentRoutes");
const notificationRoutes = require("./routes/v1/notificationRoutes");
const app = express();

app.use(express.json());
app.use(cors());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/appointments", appointmentRoutes);
app.use("/auth", authRoutes);
app.use("/doctor", doctorRoutes);
app.use("/admin", adminRoutes);
app.use("/notifications", notificationRoutes);


////////////////////////////////////////////////////////////Rabbitmq

app.post("/appointment/incomplete", async (req, res) => {
    const { userId } = req.body;
    const message = JSON.stringify({ userId, timestamp: new Date() });

    // Publish the event to the RabbitMQ queue
    await publishToQueue("incomplete_appointments", message);

    res.status(200).send("Appointment marked as incomplete and queued.");
});

consumeQueue("incomplete_appointments", (message) => {
    const data = JSON.parse(message);
    console.log(`Notifying user ${data.userId} about their incomplete appointment.`);
    // Add notification logic (e.g., send email or push notification)
});

cron.schedule("0 10 * * *", () => { // Runs daily at 10:00 AM
    console.log("Running scheduled task to process incomplete appointments...");
    consumeQueue("incomplete_appointments", (message) => {
        const data = JSON.parse(message);
        console.log(`Scheduled Task: Notifying user ${data.userId}`);
        // Add notification logic here
    });
});


cron.schedule("* 8 * * *", async () => { // Runs every day
    console.log("Running scheduled task to send daily notifications...");
    try {
        await sendEmail(
            "odevicindeneme123@gmail.com", // Replace with recipient email
            "Scheduled Notification",
            "This is a scheduled notification.",
            "<h1>This is a scheduled notification.</h1>"
        );
        console.log("Scheduled email sent successfully!");
    } catch (error) {
        console.error("Error in scheduled task:", error);
    }
});


////////////////////////////////////////////////////////////////////////

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
}).catch(err => console.error(err));
