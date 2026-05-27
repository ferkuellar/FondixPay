import type { NotificationPreference } from '../types';
import { apiRequest } from './api';

type NotificationPreferenceApiResponse = {
  id: number;
  channel: 'whatsapp';
  notification_type: 'payment_receipt';
  enabled: boolean;
  consented_at?: string;
  revoked_at?: string;
  source: string;
};

function authorization(token: string) {
  return { Authorization: `Bearer ${token}` };
}

function mapPreference(preference: NotificationPreferenceApiResponse): NotificationPreference {
  return {
    id: String(preference.id),
    channel: preference.channel,
    notificationType: preference.notification_type,
    enabled: preference.enabled,
    consentedAt: preference.consented_at,
    revokedAt: preference.revoked_at,
    source: preference.source,
  };
}

export async function getNotificationPreferences(token: string): Promise<NotificationPreference[]> {
  const preferences = await apiRequest<NotificationPreferenceApiResponse[]>('/notification-preferences', {
    headers: authorization(token),
  });
  return preferences.map(mapPreference);
}

export async function updateWhatsappReceiptPreference(token: string, enabled: boolean): Promise<NotificationPreference> {
  const preference = await apiRequest<NotificationPreferenceApiResponse>('/notification-preferences', {
    body: JSON.stringify({
      channel: 'whatsapp',
      notification_type: 'payment_receipt',
      enabled,
      source: 'mobile_profile',
    }),
    headers: authorization(token),
    method: 'PATCH',
  });
  return mapPreference(preference);
}
