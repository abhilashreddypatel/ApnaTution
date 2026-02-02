const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { getParentDashboard, getTutorDashboard } = require("../controllers/kpi.controller");

router.get("/parent", auth, getParentDashboard);
router.get("/tutor", auth, getTutorDashboard);

module.exports = router;
