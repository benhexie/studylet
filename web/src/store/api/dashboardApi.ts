import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

interface DashboardStats {
  totalAssessments: number;
  completedAssessments: number;
  averageScore: number;
  recentSessions: {
    id: string;
    assessmentTitle: string;
    score: number;
    completedAt: string;
  }[];
  subjectPerformance: {
    subject: string;
    averageScore: number;
    assessmentCount: number;
  }[];
}

interface AdminStats {
  totalAssessments: number;
  totalUsers: number;
  totalQuestions: number;
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/admin/stats',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetAdminStatsQuery } = dashboardApi; 