const mongoose = require("mongoose");

const LeadUnlockSchema = new mongoose.Schema(
    {
        tutorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TuitionLead",
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

LeadUnlockSchema.index({ tutorId: 1, leadId: 1 }, { unique: true });

module.exports = mongoose.model("LeadUnlock", LeadUnlockSchema);
