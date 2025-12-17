import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { newsService } from "../services/news.services";
import type {
  CreateNewsRequest,
  NewsParams,
  UpdateNewsRequest,
} from "../types/news.types";

export const useNews = (params: NewsParams) => {
  return useQuery({
    queryKey: ["news", params],
    queryFn: () => newsService.getNews(params),
    placeholderData: keepPreviousData,
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNewsRequest) => newsService.createNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNewsRequest }) =>
      newsService.updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => newsService.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const useDeleteNewsBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => newsService.deleteNewsBatch(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};
