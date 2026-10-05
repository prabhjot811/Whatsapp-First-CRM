import React, { createContext, useMemo, useState } from "react";
import type { Business } from "../types";
import { business as initialBusiness } from "../mock/data";

interface BusinessContextValue {
  business: Business;
  updateBusiness(updates: Partial<Omit<Business, "id" | "createdAt">>): void;
}

export const BusinessContext = createContext<
  BusinessContextValue | undefined
>(undefined);

export function BusinessProvider({ children }: React.PropsWithChildren) {
  const [business, setBusiness] = useState(initialBusiness);
  const value = useMemo<BusinessContextValue>(
    () => ({
      business,
      updateBusiness: (updates) =>
        setBusiness((current) => ({
          ...current,
          ...updates,
          updatedAt: new Date().toISOString(),
        })),
    }),
    [business],
  );

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}
