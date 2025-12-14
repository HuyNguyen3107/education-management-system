import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { publicNewsService } from "../services/public-news.services";
import type { NewsParams } from "@/features/news/types/news.types";

export const usePublicNews = (params: NewsParams) => {
  return useQuery({
    queryKey: ["public-news", params],
    queryFn: () => publicNewsService.getNews(params),
    placeholderData: keepPreviousData,
  });
};

export const usePublicNewsById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["public-news", id],
    queryFn: () => publicNewsService.getNewsById(id),
    enabled: enabled && !!id,
  });
};

