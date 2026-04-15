const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware.cjs");
const role = require("../middleware/role.middleware.cjs");
const { getParentDashboard, getTutorDashboard } = require("../controllers/kpi.controller.cjs");

router.get("/parent", auth, role("PARENT"), getParentDashboard);
router.get("/tutor", auth, role("TUTOR"), getTutorDashboard);

module.exports = router;
