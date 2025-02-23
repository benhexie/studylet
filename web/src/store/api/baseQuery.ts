import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api";
import { RootState } from "../store";

export const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    headers.set("api-secret", "ervis-api-key");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
}); 