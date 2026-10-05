import { validationRules } from "../constants/validationRules";

export function isValidPhone(value: string): boolean {
  return validationRules.phone.test(value.trim());
}

export function isValidEmail(value: string): boolean {
  return validationRules.email.test(value.trim());
}

export function getAmountError(value: string): string | null {
  const normalized = value.replace(/\s/g, "");
  if (!normalized) return "Enter an amount.";
  if (!validationRules.positiveAmount.test(normalized)) {
    return "Enter a valid amount with up to two decimal places.";
  }
  if (Number(normalized.replace(/,/g, "")) <= 0) {
    return "Amount must be greater than zero.";
  }
  return null;
}
