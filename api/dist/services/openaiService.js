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
        // Initialize text splitter with adjusted chunk size
        const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 4000, // Increased chunk size since gpt-3.5-turbo-16k can handle larger contexts
            chunkOverlap: 400,
        });
        // Split text into chunks
        const chunks = yield textSplitter.createDocuments([content]);
        // Initialize ChatOpenAI with gpt-3.5-turbo-16k
        const model = new openai_1.ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            modelName: "gpt-3.5-turbo-16k",
            temperature: 0.5, // Reduced temperature for more consistent outputs
        });
        // Create prompt template with more specific instructions
        const promptTemplate = prompts_1.PromptTemplate.fromTemplate(`
      You are a professional educator and question generator. Generate {questionCount} high-quality multiple choice questions from the following text.
      
      Requirements for each question:
      1. The question should test understanding, not just memorization
      2. Provide exactly 4 options (A, B, C, D)
      3. Options should be plausible but clearly distinguishable
      4. Include a concise but informative explanation for the correct answer
      5. Ensure all information is accurate based on the provided text
      
      Format each question as a JSON object with these exact properties:
      - text: the question text
      - options: array of 4 strings (the choices)
      - correctAnswer: the correct option (exact match with one of the options)
      - explanation: brief explanation why the answer is correct
      
      Return the questions as a valid JSON array.
      
      Text to generate questions from:
      {text}
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
            try {
                const questions = JSON.parse(result);
                allQuestions.push(...questions);
            }
            catch (parseError) {
                console.error('Failed to parse questions:', parseError);
                continue; // Skip this chunk if parsing fails
            }
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
