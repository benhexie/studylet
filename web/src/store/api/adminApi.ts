import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/api';
import { User } from './authApi';

interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

interface CreateAssessmentPayload {
  title: string;
  subject: string;
  questionCount: number;
  content: string;
  isPublic: boolean;
}

interface AssessmentResponse {
  message: string;
  assessment: {
    id: string;
    title: string;
    subject: string;
    questionCount: number;
  };
}

interface Assessment {
  id: string;
  title: string;
  subject: string;
  questions: any[];
  createdAt: string;
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/admin`,
    credentials: 'include',
  }),
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    adminLogin: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    createAssessment: builder.mutation<AssessmentResponse, CreateAssessmentPayload>({
      query: (data) => ({
        url: '/assessments',
        method: 'POST',
        body: data,
      }),
    }),
    getAssessments: builder.query<Assessment[], void>({
      query: () => '/assessments',
    }),
    deleteAssessment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/assessments/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useCreateAssessmentMutation,
  useGetAssessmentsQuery,
  useDeleteAssessmentMutation,
} = adminApi; 