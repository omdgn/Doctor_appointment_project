const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    debug: true,  // Enable SMTP debug logs
    logger: true, // Log detailed SMTP events
});

async function sendEmail(to, subject, text, html = "") {
    try {
        console.log(`Attempting to send email to: ${to}`);
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.response}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

module.exports = { sendEmail };
