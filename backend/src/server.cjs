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

        // Seed logic inside async function
        try {
            // Check if user exists to avoid duplicates or errors on restart
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

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();

