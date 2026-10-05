import { colors, type ThemeColors } from "../constants/colors";
import { radius, spacing, typography } from "../constants/typography";

export { radius, spacing, typography };

export interface AppTheme {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

export const lightTheme: AppTheme = {
  colors: colors.light,
  spacing,
  radius,
  typography,
};

export const darkTheme: AppTheme = {
  colors: colors.dark,
  spacing,
  radius,
  typography,
};
