import { useQuery } from "@tanstack/react-query";
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
