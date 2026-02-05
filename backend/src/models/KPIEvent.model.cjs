const mongoose = require("mongoose");

const KPIEventSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        eventType: {
            type: String,
            required: true
        },
        metadata: {
            type: Object
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("KPIEvent", KPIEventSchema);
