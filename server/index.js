require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/connectDB");
const router = require("./routes/Router");
const { app, server } = require("./socket/index");

const port = process.env.PORT || 8000;

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Root Route
app.get("/", (req, res) => {
    res.send(`Express App is Running on Port ${port}`);
});

//All API Routes EndPoints
app.use("/api", router);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Error: ", err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Database Connection & Server Start
const startServer = async () => {
    try {
        await connectDB();
        console.log("Database Connected Successfully");

        server.listen(port, () => {
            console.log(`Server Running on Port ${port}`);
        });
    } catch (error) {
        console.error("Database Connection Error:", error);
        process.exit(1); // Exit process on database failure
    }
};

startServer();
