import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/api";

export const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api`,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Access-Control-Allow-Credentials", "true");
    return headers;
  },
}); 