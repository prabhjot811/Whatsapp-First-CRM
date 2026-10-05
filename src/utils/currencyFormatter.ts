import type { CurrencyCode } from "../types";
import { appConfig } from "../constants/config";

export const currencySymbols: Record<CurrencyCode, string> = {
  INR: "₹",
  USD: "$",
  AED: "د.إ",
  EUR: "€",
};

export function formatCurrency(
  value: number,
  currency: CurrencyCode = appConfig.defaultCurrency,
): string {
  if (!Number.isFinite(value)) {
    throw new RangeError("Currency value must be a finite number.");
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function parseAmount(value: string): number | null {
  const normalized = value.replace(/\s/g, "");
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const amount = Number(normalized.replace(/,/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}
