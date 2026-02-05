import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';

const app = express();
app.use(express.json());

let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
}

app.get("/health", async (req, res) => {
    try {
        await connectDB();
        res.json({ status: "OK", db: "connected" });
    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: "DB connection failed" });
    }
});

// 🚫 NO app.listen()
// 🚫 NO top-level await

export default app;
