import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { publicNotificationsService } from "../services/public-notifications.services";

export const usePublicNotifications = (userId: string) => {
  return useQuery({
    queryKey: ["public-notifications", userId],
    queryFn: () => publicNotificationsService.getNotificationsByUser(userId),
    enabled: !!userId,
  });
};

export const usePublicNotificationById = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["public-notification", id],
    queryFn: () => publicNotificationsService.getNotificationById(id),
    enabled: enabled && !!id,
  });
};

export const useMarkNotificationAsSeen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publicNotificationsService.markAsSeen(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-notifications"] });
    },
  });
};

export const useUpdateNotificationResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, response }: { id: string; response: string }) =>
      publicNotificationsService.updateResponse(id, response),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["public-notification", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["public-notifications"] });
    },
  });
};
