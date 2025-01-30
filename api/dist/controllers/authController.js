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
exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        // Create new user
        const user = new User_1.default({
            name,
            email,
            password,
        });
        yield user.save();
        // Generate token
        const token = generateToken(user._id.toString());
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Return user data (excluding password)
        const userData = yield User_1.default.findById(user._id).select('-password');
        res.status(201).json({
            user: userData,
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate token
        const token = generateToken(user._id.toString());
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Return user data (excluding password)
        const userData = yield User_1.default.findById(user._id).select('-password');
        res.json({
            user: userData,
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ message: 'Logged out successfully' });
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // In a real application, you would:
        // 1. Generate a password reset token
        // 2. Save it to the user document with an expiration
        // 3. Send an email with a reset link
        res.json({ message: 'Password reset instructions sent to your email' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.forgotPassword = forgotPassword;
const sanitizeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
});
