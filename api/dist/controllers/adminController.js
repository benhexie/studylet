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
exports.getAdminStats = exports.deleteAssessment = exports.getAssessments = exports.createAssessment = exports.adminLogin = void 0;
const User_1 = __importDefault(require("../models/User"));
const Assessment_1 = __importDefault(require("../models/Assessment"));
const openaiService_1 = require("../services/openaiService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email }).select('+password');
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // Remove password from response
        const userResponse = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        };
        // Set cookie and send response
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.json({
            user: userResponse,
            token
        });
    }
    catch (error) {
        console.error('Admin Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.adminLogin = adminLogin;
const createAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, subject, questionCount = 20, content } = req.body;
        if (!content)
            return res.status(400).json({ message: 'No content provided' });
        // Generate questions using OpenAI
        const questions = yield (0, openaiService_1.generateQuestions)(content, parseInt(questionCount));
        // Create public assessment
        const assessment = new Assessment_1.default({
            title,
            subject,
            questions,
            createdBy: req.user._id,
            isPublic: true,
        });
        yield assessment.save();
        res.status(201).json({
            message: 'Assessment created successfully',
            assessment: {
                id: assessment._id,
                title: assessment.title,
                subject: assessment.subject,
                questionCount: assessment.questions.length,
            },
        });
    }
    catch (error) {
        console.error('Create Assessment Error:', error);
        res.status(500).json({ message: 'Failed to create assessment' });
    }
});
exports.createAssessment = createAssessment;
const getAssessments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assessments = yield Assessment_1.default.find({ isPublic: true })
            .select('title subject questions createdAt')
            .sort('-createdAt');
        res.json(assessments);
    }
    catch (error) {
        console.error('Get Assessments Error:', error);
        res.status(500).json({ message: 'Failed to fetch assessments' });
    }
});
exports.getAssessments = getAssessments;
const deleteAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assessment = yield Assessment_1.default.findById(req.params.id);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        if (!assessment.isPublic) {
            return res.status(403).json({ message: 'Cannot delete private assessment' });
        }
        yield assessment.deleteOne();
        res.json({ message: 'Assessment deleted successfully' });
    }
    catch (error) {
        console.error('Delete Assessment Error:', error);
        res.status(500).json({ message: 'Failed to delete assessment' });
    }
});
exports.deleteAssessment = deleteAssessment;
const getAdminStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const totalAssessments = yield Assessment_1.default.countDocuments();
        const totalUsers = yield User_1.default.countDocuments();
        const totalQuestions = yield Assessment_1.default.aggregate([
            { $unwind: "$questions" },
            { $group: { _id: null, total: { $sum: 1 } } }
        ]);
        res.json({
            totalAssessments,
            totalUsers,
            totalQuestions: ((_a = totalQuestions[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        });
    }
    catch (error) {
        console.error('Get Admin Stats Error:', error);
        res.status(500).json({ message: 'Failed to fetch statistics' });
    }
});
exports.getAdminStats = getAdminStats;
