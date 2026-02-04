const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.register = async (req, res) => {
    try {
        const { role, name, email, password } = req.body;

        if (!role || !name || !email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            ...req.body,
            password: hashedPassword
        };

        const user = await User.create(userData);

        res.status(201).json({ message: "User registered" });
    } catch (err) {
        res.status(500).json({ message: "Registration failed" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch profile" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { role, password, ...updateData } = req.body; // Don't allow changing role through this endpoint

        // If password is being updated, hash it
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        res.json(user);
    } catch (err) {
        console.error("Profile Update Error:", err);
        res.status(500).json({ message: "Update failed" });
    }
};

const sendEmail = require("../utils/sendEmail");

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Set expire (1 hour)
        user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

        await user.save();

        // Create reset url
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
            <p>Hello ${user.name},</p>
            <p>You are receiving this email because you (or someone else) has requested the reset of a password for your account on ApnaTution.</p>
            <p>Please click the button below to reset your password. This link is valid for 1 hour.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888; text-align: center;">ApnaTution - Your Trusted Tution Partner</p>
        </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Request - ApnaTution",
                html: html
            });

            res.status(200).json({ success: true, message: "Email sent" });
        } catch (err) {
            console.error("Email send error:", err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: "Email could not be sent" });
        }
    } catch (err) {
        console.error("Forgot Password Error:", err);
        res.status(500).json({ message: "Forgot Password Error" });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.resetToken)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }

        // Set new password
        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, data: "Password updated" });
    } catch (err) {
        res.status(500).json({ message: "Reset Password Error" });
    }
};
