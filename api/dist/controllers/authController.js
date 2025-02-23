"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.googleCallback = exports.resetPassword = exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const google_auth_library_1 = require("google-auth-library");
const emailService_1 = require("../services/emailService");
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        // Create new user
        const user = new User_1.default({
            firstName,
            lastName,
            email,
            password,
        });
        yield user.save();
        // Generate token
        const token = generateToken(user._id.toString());
        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Return user data (excluding password)
        const userData = yield User_1.default.findById(user._id).select("-password");
        res.status(201).json({
            user: userData,
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Check password
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate token
        const token = generateToken(user._id.toString());
        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Return user data (excluding password)
        const userData = yield User_1.default.findById(user._id).select("-password");
        res.json({
            user: userData,
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear the token cookie
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(0), // Immediately expire the cookie
            path: "/", // Ensure the cookie is cleared from all paths
        });
        res.json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Generate reset token
        const resetToken = user.createResetPasswordToken();
        yield user.save();
        // Send reset email
        yield (0, emailService_1.sendResetPasswordEmail)(email, resetToken);
        res.json({
            message: "Password reset instructions sent to your email",
        });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Failed to send reset email" });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
        const user = yield User_1.default.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({
                message: "Password reset token is invalid or has expired",
            });
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save();
        res.json({ message: "Password has been reset successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to reset password" });
    }
});
exports.resetPassword = resetPassword;
const googleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        if (!user) {
            console.log("No user found in request");
            return res.redirect(`${process.env.CLIENT_URL}/auth/login?error=auth_failed`);
        }
        // Generate token
        const token = generateToken(user._id.toString());
        console.log("Generated token for user");
        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Prepare user data (excluding password)
        const userData = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
        };
        // Redirect with user data and token as URL parameters
        const userDataParam = encodeURIComponent(JSON.stringify({ user: userData, token }));
        res.redirect(`${process.env.CLIENT_URL}/auth/login?authData=${userDataParam}`);
    }
    catch (error) {
        console.error("Google callback error:", error);
        res.redirect(`${process.env.CLIENT_URL}/auth/login?error=server_error`);
    }
});
exports.googleCallback = googleCallback;
const sanitizeUser = (user) => ({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,
});
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id).select("-password");
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getCurrentUser = getCurrentUser;
