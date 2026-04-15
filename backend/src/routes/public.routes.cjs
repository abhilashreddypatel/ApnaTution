const express = require("express");
const router = express.Router();
const { getTutors, getPublicStats, getPublicLeads } = require("../controllers/public.controller.cjs");

router.get("/tutors", getTutors);
router.get("/stats", getPublicStats);
router.get("/leads", getPublicLeads);

module.exports = router;
