const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    // Already connected
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    // Reuse existing connection (important for serverless cold starts)
    if (mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is not defined.");
    }

    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        console.log("MongoDB connected:", mongoose.connection.name);

    } catch (error) {
        isConnected = false;
        console.error("DB connection failed:", error.name, "-", error.message);
        if (error.message.includes("IP") || error.message.includes("whitelist") || error.message.includes("selection timeout")) {
            console.error("TIP: Go to MongoDB Atlas → Network Access → Add your server IP to the whitelist.");
        }
        throw error;
    }
};

module.exports = connectDB;
