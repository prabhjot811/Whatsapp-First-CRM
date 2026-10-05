export const colors = {
  light: {
    background: "#f4f8f7",
    surface: "#ffffff",
    surfaceAlt: "#edf7f6",
    border: "#dfeae8",
    textPrimary: "#102b2a",
    textSecondary: "#58706d",
    primary: "#0d8b7d",
    primaryDark: "#0b6c62",
    accent: "#dff8f4",
    success: "#17a673",
    warning: "#f2b94b",
    error: "#d94f4f",
    info: "#3b82f6",
    muted: "#eef2ef",
    shadow: "#d7eae7",
  },
  dark: {
    background: "#091818",
    surface: "#112625",
    surfaceAlt: "#143737",
    border: "#21403d",
    textPrimary: "#f0f9f8",
    textSecondary: "#b4d0cc",
    primary: "#2bd0b5",
    primaryDark: "#1ca897",
    accent: "#0d2e2e",
    success: "#2ec58c",
    warning: "#f7c65b",
    error: "#ff7b7b",
    info: "#63b3ff",
    muted: "#162d2c",
    shadow: "#061010",
  },
} as const;

export type ThemeColors = {
  [Key in keyof (typeof colors)["light"]]: string;
};
