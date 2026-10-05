import React, { createContext, useMemo, useState } from "react";
import type { User } from "../types";
import { mockAuthService } from "../mock/mockAuthService";

interface AuthContextValue {
  user: User | null;
  requestOtp(phone: string): void;
  verifyOtp(phone: string, otp: string): void;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      requestOtp: (phone) => mockAuthService.requestOtp(phone),
      verifyOtp: (phone, otp) => setUser(mockAuthService.verifyOtp(phone, otp)),
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
