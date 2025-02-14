import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api";

interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar?: string;
  joinedAt: string;
}

interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => "/user/profile",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (data) => ({
        url: "/profile",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi;
