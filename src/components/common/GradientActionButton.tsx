import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text } from "react-native";
import { typography } from "../../constants/typography";
import type { AppTheme } from "../../theme/theme";

type GradientActionButtonProps = {
  title: string;
  onPress: () => void;
  theme: AppTheme;
  fontSize?: number;
  minHeight?: number;
  disabled?: boolean;
};

export function GradientActionButton({
  title,
  onPress,
  theme,
  fontSize = typography.label,
  minHeight = 54,
  disabled = false,
}: GradientActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          borderRadius: theme.radius.md,
          boxShadow: `0px 4px 10px ${theme.colors.shadow}`,
          opacity: disabled ? 0.55 : pressed ? 0.92 : 1,
        },
      ]}
    >
      <LinearGradient
        colors={[
          theme.colors.primaryGradientStart,
          theme.colors.primaryGradientEnd,
        ]}
        end={{ x: 1, y: 0.5 }}
        start={{ x: 0, y: 0.5 }}
        style={[
          styles.gradient,
          {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radius.md,
            minHeight,
          },
        ]}
      >
        <Text
          style={[
            styles.label,
            { color: theme.colors.onPrimary, fontSize },
          ]}
        >
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    overflow: "hidden",
  },
  gradient: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: typography.label,
    fontWeight: "700",
  },
});
