import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/api';

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Assessment {
  _id: string;
  title: string;
  subject: string;
  questions: Question[];
  time: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdBy: string;
  createdAt: string;
  lastAttempt?: string;
  score?: number;
}

interface PracticeSession {
  id: string;
  assessmentId: string;
  score: number;
  timeSpent: string;
  completedAt: string;
  answers: Record<string, string>;
}

interface AssessmentResult {
  assessment: {
    title: string;
    subject: string;
    questions: Question[];
  };
  practiceSession: {
    score: number;
    timeSpent: string;
    answers: { [key: string]: string };
    completedAt: string;
  };
}

export const assessmentApi = createApi({
  reducerPath: 'assessmentApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_BASE_URL}/api`,
    credentials: 'include',
  }),
  tagTypes: ['Assessment', 'Practice'],
  endpoints: (builder) => ({
    getAssessments: builder.query<Assessment[], void>({
      query: () => '/assessments',
      providesTags: ['Assessment'],
    }),
    getAssessment: builder.query<Assessment, string>({
      query: (id) => `/assessments/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Assessment', id }],
    }),
    uploadAssessment: builder.mutation<Assessment, {
      title: string;
      subject: string;
      questionCount: number;
      content: string;
    }>({
      query: (data) => ({
        url: '/assessments/upload',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assessment'],
    }),
    getQuestions: builder.query<Question[], string>({
      query: (assessmentId) => `/assessments/${assessmentId}/questions`,
    }),
    submitPractice: builder.mutation<any, { 
      assessmentId: string;
      answers: Record<number, number>;
      timeSpent: string;
    }>({
      query: ({ assessmentId, answers, timeSpent }) => ({
        url: `/assessments/${assessmentId}/submit`,
        method: 'POST',
        body: { answers, timeSpent },
      }),
      invalidatesTags: ['Assessment'],
    }),
    getPracticeSessions: builder.query<PracticeSession[], void>({
      query: () => '/practice-sessions',
      providesTags: ['Practice'],
    }),
    getSubjects: builder.query<string[], void>({
      query: () => '/assessments/subjects',
      providesTags: ['Assessment'],
    }),
    getResults: builder.query<AssessmentResult, string>({
      query: (id) => `/assessments/${id}/results`,
      providesTags: (_result, _err, id) => [{ type: 'Assessment', id }],
    }),
  }),
});

export const {
  useGetAssessmentsQuery,
  useGetAssessmentQuery,
  useUploadAssessmentMutation,
  useGetQuestionsQuery,
  useSubmitPracticeMutation,
  useGetPracticeSessionsQuery,
  useGetSubjectsQuery,
  useGetResultsQuery,
} = assessmentApi; 