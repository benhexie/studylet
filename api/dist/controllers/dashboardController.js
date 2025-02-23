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
exports.getAdminStats = exports.getDashboardStats = void 0;
const Assessment_1 = __importDefault(require("../models/Assessment"));
const PracticeSession_1 = __importDefault(require("../models/PracticeSession"));
const User_1 = __importDefault(require("../models/User"));
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        // Get total assessments
        const totalAssessments = yield Assessment_1.default.countDocuments();
        // Get completed assessments and sessions
        const userSessions = yield PracticeSession_1.default.find({ user: userId })
            .populate('assessment', 'title subject')
            .sort({ completedAt: -1 });
        const completedAssessments = new Set(userSessions.map(s => s.assessment._id.toString())).size;
        // Calculate average score
        const averageScore = userSessions.length > 0
            ? userSessions.reduce((acc, session) => acc + session.score, 0) / userSessions.length
            : 0;
        // Get recent sessions
        const recentSessions = userSessions.slice(0, 5).map(session => ({
            id: session._id.toString(),
            assessmentTitle: session.assessment.title,
            score: session.score,
            completedAt: session.completedAt,
        }));
        // Calculate subject performance
        const subjectPerformance = yield PracticeSession_1.default.aggregate([
            { $match: { user: userId } },
            {
                $lookup: {
                    from: 'assessments',
                    localField: 'assessment',
                    foreignField: '_id',
                    as: 'assessment'
                }
            },
            { $unwind: '$assessment' },
            {
                $group: {
                    _id: '$assessment.subject',
                    averageScore: { $avg: '$score' },
                    assessmentCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    subject: '$_id',
                    averageScore: 1,
                    assessmentCount: 1,
                    _id: 0
                }
            }
        ]);
        res.json({
            totalAssessments,
            completedAssessments,
            averageScore,
            recentSessions,
            subjectPerformance,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDashboardStats = getDashboardStats;
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
