import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notification.services";
import type {
  CreateNotificationRequest,
  UpdateNotificationResponseRequest,
} from "../types/notification.types";

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationQueryKeys.all, "list"] as const,
  byUser: (userId: string) => [...notificationQueryKeys.all, "user", userId] as const,
  detail: (id: string) => [...notificationQueryKeys.all, "detail", id] as const,
};

export const useNotificationsByUser = (userId: string) => {
  return useQuery({
    queryKey: notificationQueryKeys.byUser(userId),
    queryFn: () => notificationService.getNotificationsByUser(userId),
    enabled: !!userId,
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNotificationRequest) =>
      notificationService.createNotification(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.byUser(variables.sendTo),
      });
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
};

export const useMarkAsSeen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsSeen(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
};

export const useUpdateNotificationResponse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateNotificationResponseRequest;
    }) => notificationService.updateResponse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
};

