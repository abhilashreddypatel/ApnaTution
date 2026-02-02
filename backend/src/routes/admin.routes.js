const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const { getAdminStats } = require("../controllers/kpi.controller");
const { closeLead } = require("../controllers/lead.controller");

router.get("/stats", auth, role("ADMIN"), getAdminStats);
router.patch("/leads/:id/close", auth, role("ADMIN"), closeLead);

module.exports = router;
