const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const {
    createLead,
    getMyLeads,
    getLeadsForTutor,
    unlockLead,
    updateLead,
    getLeadById
} = require("../controllers/lead.controller");

console.log("Lead Routes Loaded");  // Debug Log

router.get("/test-debug", (req, res) => res.send("Debug Route Works"));

router.post("/", auth, role("PARENT"), createLead);
router.get("/my", auth, role("PARENT"), getMyLeads);

router.get("/", auth, role("TUTOR"), getLeadsForTutor);
router.post("/:id/unlock", auth, role("TUTOR"), unlockLead);

// Generic ID routes last
router.get("/:id", auth, role("PARENT"), getLeadById);
router.put("/:id", auth, role("PARENT"), updateLead);

module.exports = router;
