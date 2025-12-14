import { http } from "@/libs/http.libs";
import type {
  CreateNewsRequest,
  News,
  NewsParams,
  PageResponse,
  UpdateNewsRequest,
} from "../types/news.types";

export const newsService = {
  getNews: async (params: NewsParams) => {
    const response = await http.get<PageResponse<News> | News[]>("/news", {
      params,
    });
    return response.data;
  },

  getNewsById: async (id: string) => {
    const response = await http.get<News>(`/news/${id}`);
    return response.data;
  },

  createNews: async (data: CreateNewsRequest) => {
    const response = await http.post<News>("/news", data);
    return response.data;
  },

  updateNews: async (id: string, data: UpdateNewsRequest) => {
    const response = await http.put<News>(`/news/${id}`, data);
    return response.data;
  },

  deleteNews: async (id: string) => {
    await http.delete(`/news/${id}`);
  },

  deleteNewsBatch: async (ids: string[]) => {
    await http.delete("/news/batch", { data: ids });
  },
};
