import mongoose from "mongoose";
import 'dotenv/config';

try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB CONNECTED");
    process.exit(0);
} catch (e) {
    console.error("DB FAILED:", e.message);
    process.exit(1);
}
