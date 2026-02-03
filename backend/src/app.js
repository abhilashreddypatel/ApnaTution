const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();
// Force Restart Trigger

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "UP" });
});

app.use("/auth", authRoutes);
app.use("/leads", require("./routes/lead.routes"));
app.use("/admin", require("./routes/admin.routes"));
app.use("/payments", require("./routes/payment.routes"));
app.use("/public", require("./routes/public.routes"));
app.use("/dashboard", require("./routes/dashboard.routes"));

module.exports = app;
