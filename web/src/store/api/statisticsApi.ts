import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

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
  baseQuery,
  tagTypes: ["Statistics"],
  endpoints: (builder) => ({
    getStatistics: builder.query<Statistics, void>({
      query: () => "/statistics",
      providesTags: ["Statistics"],
    }),
  }),
});

export const { useGetStatisticsQuery } = statisticsApi; 