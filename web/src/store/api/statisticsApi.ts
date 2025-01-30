import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/api';

interface Statistics {
  completedAssessments: number;
  averageScore: number;
  studyHours: number;
  recentActivity: {
    id: string;
    type: string;
    description: string;
    date: string;
    score: number;
  }[];
}

export const statisticsApi = createApi({
  reducerPath: 'statisticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
    credentials: 'include',
  }),
  tagTypes: ['Statistics'],
  endpoints: (builder) => ({
    getStatistics: builder.query<Statistics, void>({
      query: () => '/statistics',
      providesTags: ['Statistics'],
    }),
  }),
});

export const { useGetStatisticsQuery } = statisticsApi; 