import { Question } from '../types';

export const parseAssessmentFile = async (buffer: Buffer): Promise<Question[]> => {
  try {
    // Convert buffer to string
    const content = buffer.toString('utf-8');
    
    // Parse the content (this is a basic example - adjust based on your file format)
    const questions: Question[] = JSON.parse(content);
    
    // Validate the questions
    if (!Array.isArray(questions) || !questions.every(isValidQuestion)) {
      throw new Error('Invalid question format');
    }
    
    return questions;
  } catch (error) {
    throw new Error('Failed to parse assessment file');
  }
};

const isValidQuestion = (q: any): q is Question => {
  return (
    typeof q.text === 'string' &&
    Array.isArray(q.options) &&
    q.options.every((opt: any) => typeof opt === 'string') &&
    typeof q.correctAnswer === 'string' &&
    q.options.includes(q.correctAnswer) &&
    (!q.explanation || typeof q.explanation === 'string')
  );
}; 