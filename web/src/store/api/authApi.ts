import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
}

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface ForgotPasswordResponse {
  message: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, { email: string }>(
      {
        query: (data) => ({
          url: "/forgot-password",
          method: "POST",
          body: data,
        }),
      }
    ),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    googleAuth: builder.mutation<void, void>({
      query: () => ({
        url: "/google",
        method: "GET",
      }),
    }),
    googleCallback: builder.mutation<AuthResponse, { code: string }>({
      query: (data) => ({
        url: "/google/callback",
        method: "POST",
        body: data,
      }),
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => "/me",
    }),
    resetPassword: builder.mutation<
      { message: string },
      { token: string; password: string }
    >({
      query: (credentials) => ({
        url: "/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useLogoutMutation,
  useGoogleAuthMutation,
  useGoogleCallbackMutation,
  useGetCurrentUserQuery,
  useResetPasswordMutation,
} = authApi;
