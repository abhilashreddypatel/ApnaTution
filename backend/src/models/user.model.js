const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["PARENT", "TUTOR", "ADMIN"],
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        phone: {
            type: String
        },
        password: {
            type: String,
            required: true
        },
        subjects: {
            type: [String], // only for tutors
            default: []
        },
        tagline: {
            type: String
        },
        location: {
            type: String
        },
        rating: {
            type: Number,
            default: 0
        },
        reviewsCount: {
            type: Number,
            default: 0
        },
        experience: {
            type: String
        },
        mode: {
            type: String,
            enum: ["ONLINE", "HOME", "BOTH"],
            default: "ONLINE"
        },
        hourlyRate: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
