const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const {
    createOrder,
    verifyPayment
} = require("../controllers/payment.controller");

router.post("/create-order", auth, role("TUTOR"), createOrder);
router.post("/verify", auth, role("TUTOR"), verifyPayment);

module.exports = router;
