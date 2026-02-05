// Server Entry Point (Restart Triggered 2)
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect Database
const User = require("./models/user.model");

const startServer = async () => {
    try {
        await connectDB();

        // Seed logic (Optional for production, but kept here for now)
        try {
            const userExists = await User.findOne({ email: "test@test.com" });
            if (!userExists) {
                await User.create({
                    role: "PARENT",
                    name: "Test Parent",
                    email: "test@test.com",
                    password: "123456"
                });
                console.log("Test Parent created");
            }
        } catch (seedErr) {
            console.error("Seeding error:", seedErr.message);
        }

        // Only listen if not in a serverless environment (like Vercel)
        if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
    } catch (err) {
        console.error(err);
        // Don't exit process in serverless
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
};

startServer();

module.exports = app;

