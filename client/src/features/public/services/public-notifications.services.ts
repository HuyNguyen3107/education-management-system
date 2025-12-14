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

  markAsSeen: async (id: string): Promise<void> => {
    await http.put(API_PATHS.NOTIFICATIONS.MARK_AS_SEEN(id));
  },

  updateResponse: async (id: string, response: string): Promise<void> => {
    await http.put(API_PATHS.NOTIFICATIONS.UPDATE_RESPONSE(id), { response });
  },
};
