import axios from "axios";
import { API_BASE_URL } from "@/constants/api-path.constants";
import type {
  News,
  NewsParams,
  PageResponse,
} from "@/features/news/types/news.types";

// Create a separate axios instance for public requests (without auth token)
const publicHttp = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const publicNewsService = {
  getNews: async (params: NewsParams) => {
    const response = await publicHttp.get<PageResponse<News> | News[]>("/news", {
      params,
    });
    return response.data;
  },

  getNewsById: async (id: string) => {
    const response = await publicHttp.get<News>(`/news/${id}`);
    return response.data;
  },
};

