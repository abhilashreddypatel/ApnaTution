require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db.cjs");
const { seedPlans } = require("./controllers/payment.controller.cjs");

const app = express();

// Allowed origins
const allowedOrigins = [
    "http://localhost:4200",
    "http://localhost:3000",
    "https://apna-tution.vercel.app",
    "https://apnatution.vercel.app",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(helmet());
app.use(mongoSanitize());

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Health check (before DB middleware so it always responds)
app.get("/health", (req, res) => {
    res.json({ status: "UP", timestamp: new Date().toISOString() });
});

// DB + Seed middleware (serverless safe - reuses connection)
let seeded = false;
app.use(async (req, res, next) => {
    try {
        await connectDB();
        if (!seeded) {
            await seedPlans();
            seeded = true;
        }
        next();
    } catch (err) {
        console.error("Startup Error:", err.name, "-", err.message);
        res.status(500).json({
            message: "Service temporarily unavailable",
            error: err.message,
            tip: "Check MONGO_URI environment variable in Vercel settings."
        });
    }
});

// Routes
app.use("/auth",       require("./routes/auth.routes.cjs"));
app.use("/leads",      require("./routes/lead.routes.cjs"));
app.use("/admin",      require("./routes/admin.routes.cjs"));
app.use("/payments",   require("./routes/payment.routes.cjs"));
app.use("/public",     require("./routes/public.routes.cjs"));
app.use("/dashboard",  require("./routes/dashboard.routes.cjs"));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
