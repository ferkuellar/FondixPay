import { FEE_DESCRIPTION, FEE_LABEL, MOCK_FONDIX_FEE_MINOR, PAYMENT_CURRENCY } from '../constants/paymentFees';

export type PaymentBreakdown = {
  amountMinor: number;
  feeMinor: number;
  totalMinor: number;
  currency: string;
  feeLabel: string;
  feeDescription: string;
  isMock: boolean;
};

export function amountToMinor(amount: number) {
  return Math.round(amount * 100);
}

export function minorToMajor(amountMinor: number) {
  return amountMinor / 100;
}

export function formatMoneyMinor(amountMinor: number) {
  return `$${minorToMajor(amountMinor).toFixed(2)}`;
}

export function formatMoneyMajor(amount: number) {
  return formatMoneyMinor(amountToMinor(amount));
}

export function calculatePaymentBreakdown(amount: number): PaymentBreakdown {
  const amountMinor = amountToMinor(amount);
  return {
    amountMinor,
    feeMinor: MOCK_FONDIX_FEE_MINOR,
    totalMinor: amountMinor + MOCK_FONDIX_FEE_MINOR,
    currency: PAYMENT_CURRENCY,
    feeLabel: FEE_LABEL,
    feeDescription: FEE_DESCRIPTION,
    isMock: true,
  };
}
