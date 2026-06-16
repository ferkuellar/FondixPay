import type { TekaeSessionRequest, TekaeSessionResponse } from '../integrations/tekae/types';
import { apiRequest } from './api';

function authorization(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function startTekaeSession(
  params: TekaeSessionRequest,
  token: string,
): Promise<TekaeSessionResponse> {
  return apiRequest<TekaeSessionResponse>('/api/payments/tekae/session', {
    method: 'POST',
    headers: authorization(token),
    body: JSON.stringify(params),
  });
}
