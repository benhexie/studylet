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
exports.getStatistics = void 0;
const PracticeSession_1 = __importDefault(require("../models/PracticeSession"));
const getStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get all practice sessions for the user
        const sessions = yield PracticeSession_1.default.find({ user: req.user._id })
            .sort({ completedAt: -1 })
            .populate('assessment', 'title');
        // Calculate total study hours from timeSpent strings (format: "MM:SS" or "HH:MM:SS")
        const totalMinutes = sessions.reduce((total, session) => {
            const timeSpent = session.timeSpent;
            const parts = timeSpent.split(':').map(Number);
            if (parts.length === 2) {
                // Format is "MM:SS"
                return total + parts[0]; // Add minutes
            }
            else if (parts.length === 3) {
                // Format is "HH:MM:SS"
                return total + (parts[0] * 60) + parts[1]; // Convert hours to minutes and add minutes
            }
            return total;
        }, 0);
        const studyHours = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place
        // Calculate other statistics
        const completedAssessments = sessions.length;
        const averageScore = sessions.length > 0
            ? sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length
            : 0;
        // Get recent activity
        const recentActivity = sessions.slice(0, 10).map(session => ({
            id: session._id,
            type: 'practice',
            description: `Completed ${session.assessment.title} - Score: ${session.score.toFixed(1)}%`,
            date: session.completedAt,
            score: session.score,
        }));
        res.json({
            completedAssessments,
            averageScore,
            studyHours,
            recentActivity,
        });
    }
    catch (error) {
        console.error('Statistics Error:', error);
        res.status(500).json({ message: 'Failed to fetch statistics' });
    }
});
exports.getStatistics = getStatistics;
