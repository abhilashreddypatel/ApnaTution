const KPIEvent = require("../models/KPIEvent.model");
const LeadUnlock = require("../models/LeadUnlock.model");
const TuitionLead = require("../models/TutionLead.model");

exports.getAdminStats = async (req, res) => {
    try {
        const totalLeads = await TuitionLead.countDocuments();
        const openLeads = await TuitionLead.countDocuments({ status: "OPEN" });

        const totalUnlocks = await LeadUnlock.countDocuments();
        const revenue = await LeadUnlock.aggregate([
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        const unlockEvents = await KPIEvent.countDocuments({
            eventType: "LEAD_UNLOCK"
        });

        res.json({
            totalLeads,
            openLeads,
            totalUnlocks,
            revenue: revenue[0]?.total || 0,
            unlockEvents
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch KPIs" });
    }
};

exports.getParentDashboard = async (req, res) => {
    try {
        const totalLeads = await TuitionLead.countDocuments({ parentId: req.user.id });
        const activeLeads = await TuitionLead.countDocuments({ parentId: req.user.id, status: "OPEN" });

        // Count how many times their leads were unlocked (sum total)
        const leads = await TuitionLead.find({ parentId: req.user.id }).select('_id');
        const leadIds = leads.map(l => l._id);
        const totalInterest = await LeadUnlock.countDocuments({ leadId: { $in: leadIds } });

        res.json({
            totalLeads,
            activeLeads,
            totalInterest
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch dashboard" });
    }
};

exports.getTutorDashboard = async (req, res) => {
    try {
        const unlockedCount = await LeadUnlock.countDocuments({ tutorId: req.user.id });
        const availableLeads = await TuitionLead.countDocuments({ status: "OPEN" });

        res.json({
            unlockedCount,
            availableLeads
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch dashboard" });
    }
};
