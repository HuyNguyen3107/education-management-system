import { http } from "@/libs/http.libs";
import { API_PATHS } from "@/constants/api-path.constants";
import type {
  Notification,
  CreateNotificationRequest,
  UpdateNotificationResponseRequest,
} from "../types/notification.types";

export const notificationService = {
  getNotificationsByUser: async (userId: string): Promise<Notification[]> => {
    const response = await http.get<Notification[]>(
      API_PATHS.NOTIFICATIONS.GET_ALL_BY_USER(userId)
    );
    return response.data;
  },

  createNotification: async (
    data: CreateNotificationRequest
  ): Promise<Notification> => {
    const response = await http.post<Notification>(
      API_PATHS.NOTIFICATIONS.CREATE,
      data
    );
    return response.data;
  },

  markAsSeen: async (id: string): Promise<void> => {
    await http.put(API_PATHS.NOTIFICATIONS.MARK_AS_SEEN(id));
  },

  updateResponse: async (
    id: string,
    data: UpdateNotificationResponseRequest
  ): Promise<void> => {
    await http.put(API_PATHS.NOTIFICATIONS.UPDATE_RESPONSE(id), data);
  },

  deleteNotification: async (id: string): Promise<void> => {
    await http.delete(API_PATHS.NOTIFICATIONS.DELETE(id));
  },
};

