const TuitionLead = require("../models/TutionLead.model");
const LeadUnlock = require("../models/LeadUnlock.model");
const KPIEvent = require("../models/KPIEvent.model");

exports.createLead = async (req, res) => {
    try {
        const lead = await TuitionLead.create({
            ...req.body,
            parentId: req.user.id
        });

        res.status(201).json(lead);
    } catch (err) {
        console.error("Create Lead Error:", err);
        res.status(500).json({ message: "Failed to create lead", error: err.message });
    }
};

exports.getMyLeads = async (req, res) => {
    try {
        const leads = await TuitionLead.find({ parentId: req.user.id });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch leads" });
    }
};

// Tutor: list all OPEN leads
exports.getLeadsForTutor = async (req, res) => {
    try {
        const leads = await TuitionLead.find({ status: "OPEN" })
            .sort({ createdAt: -1 });

        const unlocked = await LeadUnlock.find({ tutorId: req.user.id })
            .select("leadId");

        const unlockedIds = unlocked.map(u => u.leadId.toString());

        const result = leads.map(l => ({
            ...l.toObject(),
            isUnlocked: unlockedIds.includes(l._id.toString())
        }));

        // KPI Tracking
        await KPIEvent.create({
            userId: req.user.id,
            eventType: "LEAD_VIEW",
            metadata: { count: leads.length }
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch leads" });
    }
};

exports.unlockLead = async (req, res) => {
    try {
        const tutorId = req.user.id;
        const leadId = req.params.id;

        const alreadyUnlocked = await LeadUnlock.findOne({ tutorId, leadId });
        if (alreadyUnlocked) {
            return res.status(409).json({ message: "Lead already unlocked" });
        }

        // 🔥 PAYMENT PLACEHOLDER (important)
        const price = 99; // later from config / plan

        await LeadUnlock.create({ tutorId, leadId, price });

        await KPIEvent.create({
            userId: tutorId,
            eventType: "LEAD_UNLOCK",
            metadata: { leadId, price }
        });

        res.json({ message: "Lead unlocked" });
    } catch (err) {
        res.status(500).json({ message: "Unlock failed" });
    }
};

exports.closeLead = async (req, res) => {
    try {
        await TuitionLead.findByIdAndUpdate(req.params.id, {
            status: "CLOSED"
        });
        res.json({ message: "Lead closed" });
    } catch (err) {
        res.status(500).json({ message: "Failed to close lead" });
    }
};
