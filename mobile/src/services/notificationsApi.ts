import type { NotificationItem, NotificationType } from '../types';
import { apiRequest } from './api';

type NotificationApiResponse = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  entity_type?: string;
  entity_id?: string;
  is_read: boolean;
  created_at: string;
};

function authorization(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function mapNotification(notification: NotificationApiResponse): NotificationItem {
  return {
    id: String(notification.id),
    type: notification.type,
    title: notification.title,
    message: notification.message,
    entityType: notification.entity_type,
    entityId: notification.entity_id,
    status: notification.is_read ? 'read' : 'unread',
    createdAt: notification.created_at,
  };
}

export async function getNotifications(token: string): Promise<NotificationItem[]> {
  const notifications = await apiRequest<NotificationApiResponse[]>('/notifications', {
    headers: authorization(token),
  });
  return notifications.map(mapNotification);
}

export async function markNotificationRead(token: string, id: string): Promise<NotificationItem> {
  const notification = await apiRequest<NotificationApiResponse>(`/notifications/${id}/read`, {
    headers: authorization(token),
    method: 'PATCH',
  });
  return mapNotification(notification);
}
