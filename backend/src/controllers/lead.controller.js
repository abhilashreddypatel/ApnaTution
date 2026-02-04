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
        const Transaction = require("../models/Transaction.model");
        const User = require("../models/user.model");

        const alreadyUnlocked = await LeadUnlock.findOne({ tutorId, leadId });
        if (alreadyUnlocked) {
            return res.status(409).json({ message: "Lead already unlocked" });
        }

        const user = await User.findById(tutorId);
        if (!user.points || user.points < 1) {
            return res.status(403).json({ message: "Insufficient points. Please recharge." });
        }

        // Deduct Point
        user.points -= 1;
        await user.save();

        // Record Unlock
        await LeadUnlock.create({
            tutorId,
            leadId,
            price: 1
        });

        // Record Debit Transaction
        await Transaction.create({
            userId: tutorId,
            amount: 0,
            points: 1,
            type: "DEBIT",
            description: `Unlocked Lead (ID: ${leadId})`,
            status: "SUCCESS"
        });

        await KPIEvent.create({
            userId: tutorId,
            eventType: "LEAD_UNLOCK",
            metadata: { leadId, price: 1 }
        });

        res.json({ message: "Lead unlocked successfully!", remainingPoints: user.points });
    } catch (err) {
        console.error("Unlock Error:", err);
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

exports.updateLead = async (req, res) => {
    try {
        const lead = await TuitionLead.findOne({ _id: req.params.id, parentId: req.user.id });
        if (!lead) {
            return res.status(404).json({ message: "Lead not found or unauthorized" });
        }

        const updatedLead = await TuitionLead.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );

        res.json(updatedLead);
    } catch (err) {
        console.error("Update Lead Error:", err);
        res.status(500).json({ message: "Failed to update lead" });
    }
};

exports.getLeadById = async (req, res) => {
    try {
        console.log(`Fetching Lead: ${req.params.id} for User: ${req.user.id}`);

        // Debug check: Does lead exist at all?
        const leadCheck = await TuitionLead.findById(req.params.id);
        if (!leadCheck) {
            console.log("Lead does not exist in DB");
            return res.status(404).json({ message: "Lead not found in DB" });
        } else {
            console.log(`Lead exists. Owner: ${leadCheck.parentId}, Requestor: ${req.user.id}`);
        }

        const lead = await TuitionLead.findOne({ _id: req.params.id, parentId: req.user.id });
        if (!lead) {
            console.log("Lead found but Parent ID mismatch");
            // For now, let's return it ANYWAY if it belongs to someone else, JUST FOR DEBUGGING, 
            // OR return the mismatch error more clearly.
            // Actually, let's Just return 404 but we know why now from server logs.
            return res.status(404).json({ message: "Lead not found (Parent mismatch)" });
        }
        res.json(lead);
    } catch (err) {
        console.error("GetLeadById Error:", err);
        res.status(500).json({ message: "Failed to fetch lead" });
    }
};
