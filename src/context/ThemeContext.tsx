import React, { createContext, useMemo, useState } from "react";
import { darkTheme, lightTheme, type AppTheme } from "../theme/theme";

interface ThemeContextValue {
  theme: AppTheme;
  isDarkMode: boolean;
  toggleTheme(): void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const value = useMemo(
    () => ({
      theme: isDarkMode ? darkTheme : lightTheme,
      isDarkMode,
      toggleTheme: () => setIsDarkMode((current) => !current),
    }),
    [isDarkMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
