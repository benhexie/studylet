"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const practiceSessionSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assessment: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true,
    },
    answers: {
        type: Map,
        of: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    timeSpent: {
        type: String,
        required: true,
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model('PracticeSession', practiceSessionSchema);
