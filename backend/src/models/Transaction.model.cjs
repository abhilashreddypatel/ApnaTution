const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ["CREDIT", "DEBIT"], // CREDIT = Bought points, DEBIT = Used points
            required: true
        },
        points: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubscriptionPlan"
        },
        couponCode: {
            type: String
        },
        status: {
            type: String,
            enum: ["PENDING", "SUCCESS", "FAILED"],
            default: "PENDING"
        },
        paymentId: {
            type: String // For Gateway Order ID
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
