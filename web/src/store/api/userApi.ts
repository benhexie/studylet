import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "./authApi";
import { baseQuery } from "./baseQuery";

interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => "/api/user/profile",
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
