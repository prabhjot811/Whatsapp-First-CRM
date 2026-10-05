import type { CurrencyCode } from "../types";

export const appConfig = {
  businessId: "business-1",
  defaultCurrency: "INR" satisfies CurrencyCode,
  defaultCountryCode: "+91",
  otpLength: 6,
} as const;
