import type { Account, Balance, Movement } from '../types';
import { apiRequest } from './api';

type AccountApiResponse = {
  id: number;
  account_type: string;
  status: Account['status'];
  currency: string;
  is_demo: boolean;
  created_at: string;
};

type BalanceApiResponse = {
  account_id: number;
  available_minor: number;
  pending_minor: number;
  held_minor: number;
  simulated_minor: number;
  currency: string;
  is_demo: boolean;
  is_real_money: boolean;
  label: string;
  disclaimer: string;
  as_of: string;
};

type MovementApiResponse = {
  id: number;
  movement_type: Movement['type'];
  direction: Movement['direction'];
  amount_minor: number;
  currency: string;
  status: string;
  description: string;
  is_demo: boolean;
  created_at: string;
};

function authorization(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAccount(token: string): Promise<Account> {
  const account = await apiRequest<AccountApiResponse>('/account', { headers: authorization(token) });
  return {
    id: account.id,
    accountType: account.account_type,
    status: account.status,
    currency: account.currency,
    isDemo: account.is_demo,
    createdAt: account.created_at,
  };
}

export async function getBalance(token: string): Promise<Balance> {
  const balance = await apiRequest<BalanceApiResponse>('/account/balance', { headers: authorization(token) });
  return {
    accountId: balance.account_id,
    availableMinor: balance.available_minor,
    pendingMinor: balance.pending_minor,
    heldMinor: balance.held_minor,
    simulatedMinor: balance.simulated_minor,
    currency: balance.currency,
    isDemo: balance.is_demo,
    isRealMoney: balance.is_real_money,
    label: balance.label,
    disclaimer: balance.disclaimer,
    asOf: balance.as_of,
  };
}

export async function getMovements(token: string): Promise<Movement[]> {
  const movements = await apiRequest<MovementApiResponse[]>('/account/movements', { headers: authorization(token) });
  return movements.map((movement) => ({
    id: movement.id,
    type: movement.movement_type,
    direction: movement.direction,
    amountMinor: movement.amount_minor,
    currency: movement.currency,
    status: movement.status,
    description: movement.description,
    isDemo: movement.is_demo,
    createdAt: movement.created_at,
  }));
}
