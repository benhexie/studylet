export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar?: string;
  joinedAt: Date;
}

export interface Assessment {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: Question[];
  createdBy: string;
  fileUrl?: string;
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface PracticeSession {
  id: string;
  user: string;
  assessment: string;
  answers: Record<string, string>;
  score: number;
  timeSpent: string;
  completedAt: Date;
} 