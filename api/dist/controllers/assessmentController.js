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
exports.getResults = exports.getSubjects = exports.getPracticeSessions = exports.submitPractice = exports.getQuestions = exports.uploadAssessment = exports.getAssessment = exports.getAssessments = void 0;
const Assessment_1 = __importDefault(require("../models/Assessment"));
const PracticeSession_1 = __importDefault(require("../models/PracticeSession"));
const stream_1 = require("stream");
const openaiService_1 = require("../services/openaiService");
const mongoose_1 = __importDefault(require("mongoose"));
const getAssessments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find assessments that are either public or created by the user
        const assessments = yield Assessment_1.default.find({
            $or: [
                { createdBy: req.user._id }, // User's own assessments
                { isPublic: true }, // Public assessments
            ],
        })
            .select("title subject questions difficulty createdAt lastAttempt score")
            .sort("-createdAt");
        // Get last attempt for each assessment
        const assessmentsWithAttempts = yield Promise.all(assessments.map((assessment) => __awaiter(void 0, void 0, void 0, function* () {
            const lastAttempt = yield PracticeSession_1.default.findOne({
                user: req.user._id,
                assessment: assessment._id,
            })
                .sort({ completedAt: -1 })
                .select("score completedAt")
                .lean();
            return Object.assign(Object.assign({}, assessment.toObject()), { lastAttempt: lastAttempt === null || lastAttempt === void 0 ? void 0 : lastAttempt.completedAt, score: lastAttempt === null || lastAttempt === void 0 ? void 0 : lastAttempt.score });
        })));
        res.json(assessmentsWithAttempts);
    }
    catch (error) {
        console.error("Get Assessments Error:", error);
        res.status(500).json({ message: "Failed to fetch assessments" });
    }
});
exports.getAssessments = getAssessments;
const getAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assessment = yield Assessment_1.default.findById(req.params.id).select("title questions subject difficulty");
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }
        res.json(assessment);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getAssessment = getAssessment;
const uploadAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, subject, questionCount = 20, content } = req.body;
        if (!content) {
            return res.status(400).json({ message: "No content provided" });
        }
        // return res.status(201).json({
        //   message: "Assessment created successfully",
        //   assessment: {
        //     id: "123",
        //     title: title,
        //     subject: subject,
        //     questionCount: questionCount,
        //   },
        // });
        // Generate questions using OpenAI
        const questions = yield (0, openaiService_1.generateQuestions)(content, parseInt(questionCount));
        // Create assessment without document field
        const assessment = new Assessment_1.default({
            title,
            subject,
            questions,
            createdBy: req.user._id,
        });
        yield assessment.save();
        res.status(201).json({
            message: "Assessment created successfully",
            assessment: {
                id: assessment._id,
                title: assessment.title,
                subject: assessment.subject,
                questionCount: assessment.questions.length,
            },
        });
    }
    catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Failed to process document" });
    }
});
exports.uploadAssessment = uploadAssessment;
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assessment = yield Assessment_1.default.findById(req.params.id).select("questions");
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }
        // Remove correct answers before sending to client
        const questions = assessment.questions.map((q) => ({
            id: q._id,
            text: q.text,
            options: q.options,
        }));
        res.json(questions);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getQuestions = getQuestions;
const submitPractice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: assessmentId } = req.params;
        const { answers, timeSpent } = req.body;
        const userId = req.user._id;
        // Calculate score
        const assessment = yield Assessment_1.default.findById(assessmentId);
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found" });
        }
        let correctAnswers = 0;
        assessment.questions.forEach((question, index) => {
            // Convert the answer index to string to match with options array
            const userAnswer = answers[index.toString()];
            const correctAnswer = question.options[question.options.indexOf(question.correctAnswer)];
            if (question.options[parseInt(userAnswer)] === correctAnswer)
                correctAnswers++;
        });
        const calculatedScore = (correctAnswers / assessment.questions.length) * 100;
        // Save practice session
        const practiceSession = yield PracticeSession_1.default.create({
            user: userId,
            assessment: assessmentId,
            score: calculatedScore,
            timeSpent,
            answers,
        });
        // Return the full session
        res.json(yield practiceSession.populate("assessment"));
    }
    catch (error) {
        console.error("Submit practice error:", error);
        res.status(500).json({ message: "Failed to submit practice" });
    }
});
exports.submitPractice = submitPractice;
const getPracticeSessions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assessmentId } = req.params;
        const userId = req.user._id;
        const sessions = yield PracticeSession_1.default.find({
            assessment: assessmentId,
            user: userId,
        })
            .sort({ completedAt: -1 }) // Most recent first
            .select("score timeSpent completedAt answers");
        res.json(sessions);
    }
    catch (error) {
        console.error("Get practice sessions error:", error);
        res.status(500).json({ message: "Failed to get practice sessions" });
    }
});
exports.getPracticeSessions = getPracticeSessions;
const bufferToStream = (buffer) => {
    const readable = new stream_1.Readable({
        read() {
            this.push(buffer);
            this.push(null);
        },
    });
    return readable;
};
const getSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield Assessment_1.default.distinct("subject");
        res.json(subjects);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getSubjects = getSubjects;
const getResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id))
            return res.status(400).json({ message: "Invalid ID format" });
        // Find practice session by assessment ID
        const practiceSession = yield PracticeSession_1.default.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).select("score timeSpent answers completedAt assessment");
        if (!practiceSession)
            return res.status(404).json({ message: "Practice session not found" });
        // Then find the associated assessment
        const assessment = yield Assessment_1.default.findById(practiceSession.assessment).select("title subject questions");
        if (!assessment)
            return res.status(404).json({ message: "Assessment not found" });
        res.json({
            assessment: {
                title: assessment.title,
                subject: assessment.subject,
                questions: assessment.questions,
            },
            practiceSession: {
                score: practiceSession.score,
                timeSpent: practiceSession.timeSpent,
                answers: practiceSession.answers,
                completedAt: practiceSession.completedAt,
            },
        });
    }
    catch (error) {
        console.error("Results Error:", error);
        res.status(500).json({ message: "Failed to fetch results" });
    }
});
exports.getResults = getResults;
