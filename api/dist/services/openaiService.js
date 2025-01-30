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
exports.generateQuestions = void 0;
const openai_1 = require("@langchain/openai");
const text_splitter_1 = require("langchain/text_splitter");
const prompts_1 = require("@langchain/core/prompts");
const output_parsers_1 = require("@langchain/core/output_parsers");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `${__dirname}/../../.env` });
const generateQuestions = (content_1, ...args_1) => __awaiter(void 0, [content_1, ...args_1], void 0, function* (content, questionCount = 50) {
    try {
        // Initialize text splitter
        const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 2000,
            chunkOverlap: 200,
        });
        // Split text into chunks
        const chunks = yield textSplitter.createDocuments([content]);
        // Initialize ChatOpenAI
        const model = new openai_1.ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            modelName: "gpt-4",
            temperature: 0.7,
        });
        // Create prompt template
        const promptTemplate = prompts_1.PromptTemplate.fromTemplate(`
      Generate {questionCount} multiple choice questions from the following text.
      For each question, provide 4 options, the correct answer, and a brief explanation.
      Format each question as a JSON object with properties: text, options (array), correctAnswer, and explanation.
      Return the questions as a JSON array.
      
      Text: {text}
    `);
        // Process each chunk and generate questions
        const allQuestions = [];
        const questionsPerChunk = Math.ceil(questionCount / chunks.length);
        for (const chunk of chunks) {
            const chain = promptTemplate
                .pipe(model)
                .pipe(new output_parsers_1.StringOutputParser());
            const result = yield chain.invoke({
                questionCount: questionsPerChunk,
                text: chunk.pageContent,
            });
            const questions = JSON.parse(result);
            allQuestions.push(...questions);
        }
        // Return only the requested number of questions
        return allQuestions.slice(0, questionCount);
    }
    catch (error) {
        console.error('OpenAI Error:', error);
        throw new Error('Failed to generate questions');
    }
});
exports.generateQuestions = generateQuestions;
