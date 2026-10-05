export const validationRules = {
  phone: /^\+?[0-9][0-9\s()-]{8,18}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  positiveAmount: /^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/,
  isoDate: /^\d{4}-\d{2}-\d{2}$/,
} as const;
