export interface Notification {
  id: string;
  title: string;
  content: string;
  sendTo: string;
  seenDate: string | null;
  response: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationWithUser extends Notification {
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface CreateNotificationRequest {
  title: string;
  content: string;
  sendTo: string;
}

export interface UpdateNotificationResponseRequest {
  response: string;
}
