const Razorpay = require("razorpay");
const crypto = require("crypto");
const LeadUnlock = require("../models/LeadUnlock.model");
const KPIEvent = require("../models/KPIEvent.model");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

exports.createOrder = async (req, res) => {
    try {
        const { leadId } = req.body;

        const options = {
            amount: 9900, // INR 99 in paise
            currency: "INR",
            receipt: `lead_${leadId}_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create order" });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            leadId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment" });
        }

        // Payment is valid → unlock lead
        await LeadUnlock.create({
            tutorId: req.user.id,
            leadId,
            price: 99
        });

        await KPIEvent.create({
            userId: req.user.id,
            eventType: "PAYMENT_SUCCESS",
            metadata: { leadId, amount: 99 }
        });

        res.json({ message: "Payment verified & lead unlocked" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Payment verification failed" });
    }
};
