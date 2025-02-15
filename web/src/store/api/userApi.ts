import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api";
import { User } from "./authApi";

interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/user`,
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
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi;
