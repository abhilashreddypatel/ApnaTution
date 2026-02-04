const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        discountPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        expiryDate: {
            type: Date
        },
        isActive: {
            type: Boolean,
            default: true
        },
        usageLimit: {
            type: Number,
            default: 1000
        },
        usedCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Coupon", CouponSchema);
