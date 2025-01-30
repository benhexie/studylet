"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
        required: true,
    },
    options: [{
            type: String,
            required: true,
        }],
    correctAnswer: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
        required: true,
    },
});
const assessmentSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    questions: [questionSchema],
    time: {
        type: Number,
        default: 60,
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium',
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Assessment', assessmentSchema);
