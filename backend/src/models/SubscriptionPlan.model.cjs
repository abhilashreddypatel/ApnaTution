const mongoose = require("mongoose");

const SubscriptionPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String, // e.g., "DeepMind Starter", "Tutor Pro"
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        points: {
            type: Number,
            required: true
        },
        discountDescription: {
            type: String // e.g., "Save 20%"
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);
