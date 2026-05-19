import { apiRequest } from './api';

export type AuthUser = {
  id: number;
  phone: string;
  name?: string | null;
};

type RequestOtpResponse = {
  message: string;
  otp_dev: string;
};

type VerifyOtpResponse = {
  access_token: string;
  token_type: 'bearer';
  user: AuthUser;
};

export function requestOtp(phone: string) {
  return apiRequest<RequestOtpResponse>('/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export function verifyOtp(phone: string, otp: string) {
  return apiRequest<VerifyOtpResponse>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, otp }),
  });
}

export function getMe(token: string) {
  return apiRequest<AuthUser>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function logout(token?: string) {
  return apiRequest<{ message: string }>('/auth/logout', {
    method: 'POST',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });
}
