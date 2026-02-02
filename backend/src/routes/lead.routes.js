const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const {
    createLead,
    getMyLeads,
    getLeadsForTutor,
    unlockLead
} = require("../controllers/lead.controller");

router.post("/", auth, role("PARENT"), createLead);
router.get("/my", auth, role("PARENT"), getMyLeads);

router.get("/", auth, role("TUTOR"), getLeadsForTutor);
router.post("/:id/unlock", auth, role("TUTOR"), unlockLead);

module.exports = router;
