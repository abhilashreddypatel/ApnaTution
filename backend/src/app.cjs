const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes.cjs");

const app = express();

const connectDB = require("./config/db.cjs");

const { seedPlans } = require("./controllers/payment.controller.cjs");

app.use(cors());
app.use(express.json());

// Database connection middleware for serverless compatibility
app.use(async (req, res, next) => {
    try {
        await connectDB();
        await seedPlans(); // Ensure plans are seeded
        next();
    } catch (err) {
        console.error("Critical Database Error:", err.message);
        res.status(500).json({
            message: "Database connection error",
            error: err.message,
            tip: "Check your MongoDB Atlas IP Whitelist and .env credentials."
        });
    }
});


app.get("/health", (req, res) => {
    res.json({ status: "UP" });
});

app.use("/auth", authRoutes);
app.use("/leads", require("./routes/lead.routes.cjs"));
app.use("/admin", require("./routes/admin.routes.cjs"));
app.use("/payments", require("./routes/payment.routes.cjs"));
app.use("/public", require("./routes/public.routes.cjs"));
app.use("/dashboard", require("./routes/dashboard.routes.cjs"));

module.exports = app;
