import { useCallback } from "react";
import { useBusiness } from "./useBusiness";
import { formatCurrency } from "../utils/currencyFormatter";

export function useCurrencyFormatter() {
  const { business } = useBusiness();
  return useCallback(
    (value: number) => formatCurrency(value, business.currency),
    [business.currency],
  );
}
