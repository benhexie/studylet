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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAssessmentFile = void 0;
const parseAssessmentFile = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Convert buffer to string
        const content = buffer.toString('utf-8');
        // Parse the content (this is a basic example - adjust based on your file format)
        const questions = JSON.parse(content);
        // Validate the questions
        if (!Array.isArray(questions) || !questions.every(isValidQuestion)) {
            throw new Error('Invalid question format');
        }
        return questions;
    }
    catch (error) {
        throw new Error('Failed to parse assessment file');
    }
});
exports.parseAssessmentFile = parseAssessmentFile;
const isValidQuestion = (q) => {
    return (typeof q.text === 'string' &&
        Array.isArray(q.options) &&
        q.options.every((opt) => typeof opt === 'string') &&
        typeof q.correctAnswer === 'string' &&
        q.options.includes(q.correctAnswer) &&
        (!q.explanation || typeof q.explanation === 'string'));
};
