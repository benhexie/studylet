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
    // Initialize text splitter
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 200,
    });

    // Split text into chunks
    const chunks = await textSplitter.createDocuments([content]);

    // Initialize ChatOpenAI
    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4",
      temperature: 0.7,
    });

    // Create prompt template
    const promptTemplate = PromptTemplate.fromTemplate(`
      Generate {questionCount} multiple choice questions from the following text.
      For each question, provide 4 options, the correct answer, and a brief explanation.
      Format each question as a JSON object with properties: text, options (array), correctAnswer, and explanation.
      Return the questions as a JSON array.
      
      Text: {text}
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

      const questions = JSON.parse(result);
      allQuestions.push(...questions);
    }

    // Return only the requested number of questions
    return allQuestions.slice(0, questionCount);
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw new Error('Failed to generate questions');
  }
}; 