require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

// Middleware
app.use(cors({ origin: "http://localhost:5000" }));
app.use(morgan("dev"));

// ✅ Corrected Routes Based on `server.js`
const routes = {
    "/auth": SERVER_URL,
    "/doctor": SERVER_URL,
    "/admin": SERVER_URL,
    "/appointments": SERVER_URL,
    "/notifications": SERVER_URL, 
};

// Apply Proxy Middleware with Error Handling
Object.keys(routes).forEach((route) => {
    app.use(
        route,
        createProxyMiddleware({
            target: routes[route],
            changeOrigin: true,
            onError: (err, req, res) => {
                console.error(`Error connecting to ${routes[route]}`, err.message);
                res.status(502).json({ error: "Bad Gateway. Backend service is unavailable." });
            },
        })
    );
});

// Health Check Route
app.get("/", (req, res) => {
    res.send("API Gateway is running...");
});

// Start Gateway Server
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
