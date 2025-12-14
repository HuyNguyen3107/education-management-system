import { http } from "@/libs/http.libs";
import { API_PATHS } from "@/constants/api-path.constants";
import type { Notification } from "@/features/notifications/types/notification.types";

export const publicNotificationsService = {
  getNotificationsByUser: async (userId: string): Promise<Notification[]> => {
    const response = await http.get<Notification[]>(
      API_PATHS.NOTIFICATIONS.GET_ALL_BY_USER(userId)
    );
    return response.data;
  },

  getNotificationById: async (id: string): Promise<Notification> => {
    const response = await http.get<Notification>(
      API_PATHS.NOTIFICATIONS.GET_BY_ID(id)
    );
    return response.data;
  },
};
