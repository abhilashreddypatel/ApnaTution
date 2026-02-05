const express = require("express");
const router = express.Router();
const { getTutors, getPublicStats } = require("../controllers/public.controller.cjs");

router.get("/tutors", getTutors);
router.get("/stats", getPublicStats);

module.exports = router;
