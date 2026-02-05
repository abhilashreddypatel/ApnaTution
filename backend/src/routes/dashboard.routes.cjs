const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware.cjs");
const { getParentDashboard, getTutorDashboard } = require("../controllers/kpi.controller.cjs");

router.get("/parent", auth, getParentDashboard);
router.get("/tutor", auth, getTutorDashboard);

module.exports = router;
