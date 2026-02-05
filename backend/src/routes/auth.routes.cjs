const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile, forgotPassword, resetPassword } = require("../controllers/auth.controller.cjs");
const auth = require("../middleware/auth.middleware.cjs");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

module.exports = router;
