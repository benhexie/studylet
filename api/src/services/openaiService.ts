import { ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../../.env`});

interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const generateQuestions = async (
  content: string,
  questionCount: number = 50
): Promise<Question[]> => {
  try {
    // Initialize text splitter with adjusted chunk size
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 4000, // Increased chunk size since gpt-3.5-turbo-16k can handle larger contexts
      chunkOverlap: 400,
    });

    // Split text into chunks
    const chunks = await textSplitter.createDocuments([content]);

    // Initialize ChatOpenAI with gpt-3.5-turbo-16k
    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo-16k",
      temperature: 0.5, // Reduced temperature for more consistent outputs
    });

    // Create prompt template with more specific instructions
    const promptTemplate = PromptTemplate.fromTemplate(`
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
    const allQuestions: Question[] = [];
    const questionsPerChunk = Math.ceil(questionCount / chunks.length);

    for (const chunk of chunks) {
      const chain = promptTemplate
        .pipe(model)
        .pipe(new StringOutputParser());

      const result = await chain.invoke({
        questionCount: questionsPerChunk,
        text: chunk.pageContent,
      });

      try {
        const questions = JSON.parse(result);
        allQuestions.push(...questions);
      } catch (parseError) {
        console.error('Failed to parse questions:', parseError);
        continue; // Skip this chunk if parsing fails
      }
    }

    // Return only the requested number of questions
    return allQuestions.slice(0, questionCount);
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw new Error('Failed to generate questions');
  }
}; 