import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/api';

interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar?: string;
  joinedAt: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  studentId?: string;
  avatar?: File;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_BASE_URL}/api`,
    credentials: 'include',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<User, UpdateUserRequest>({
      query: (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });
        
        return {
          url: '/user/profile',
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
} = userApi; 