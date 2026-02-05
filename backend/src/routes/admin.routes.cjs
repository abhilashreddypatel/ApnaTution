const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware.cjs");
const role = require("../middleware/role.middleware.cjs");
const { getAdminStats } = require("../controllers/kpi.controller.cjs");
const { closeLead } = require("../controllers/lead.controller.cjs");

router.get("/stats", auth, role("ADMIN"), getAdminStats);
router.patch("/leads/:id/close", auth, role("ADMIN"), closeLead);

module.exports = router;
