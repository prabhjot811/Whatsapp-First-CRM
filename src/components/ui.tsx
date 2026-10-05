import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { AppTheme } from "../theme/theme";

type ButtonVariant = "primary" | "secondary" | "ghost";

export type AppButtonProps = {
  title: string;
  onPress: () => void;
  theme: AppTheme;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
};

export function AppButton({
  title,
  onPress,
  theme,
  variant = "primary",
  disabled = false,
  loading = false,
}: AppButtonProps) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const backgroundColor = isPrimary
    ? theme.colors.primary
    : isSecondary
      ? theme.colors.surfaceAlt
      : "transparent";
  const textColor = isPrimary ? "#ffffff" : theme.colors.textPrimary;
  const borderColor = isSecondary ? theme.colors.border : theme.colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: disabled || loading ? 0.7 : pressed ? 0.9 : 1,
          backgroundColor,
          borderWidth: variant === "ghost" ? 1 : 0,
          borderColor,
        },
        styles.button,
      ]}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>
        {loading ? "Please wait..." : title}
      </Text>
    </Pressable>
  );
}

export type InputFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  theme: AppTheme;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  multiline?: boolean;
  secureTextEntry?: boolean;
};

export function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  theme,
  keyboardType = "default",
  multiline = false,
  secureTextEntry = false,
}: InputFieldProps) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType={keyboardType}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.textPrimary,
          },
        ]}
      />
    </View>
  );
}

type StatusBadgeProps = {
  label: string;
  tone: "success" | "warning" | "error" | "info" | "neutral";
  theme: AppTheme;
};

export function StatusBadge({ label, tone, theme }: StatusBadgeProps) {
  const map: Record<StatusBadgeProps["tone"], string> = {
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error,
    info: theme.colors.info,
    neutral: theme.colors.border,
  };

  return (
    <View style={[styles.badge, { backgroundColor: map[tone] + "20" }]}>
      <Text
        style={[
          styles.badgeText,
          { color: tone === "neutral" ? theme.colors.textPrimary : map[tone] },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export type CardProps = {
  children: React.ReactNode;
  theme: AppTheme;
  style?: object;
};

export function Card({ children, theme, style }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  theme: AppTheme;
};

export function SectionHeader({ title, subtitle, theme }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[
            styles.sectionSubtitle,
            { color: theme.colors.textSecondary },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  theme: AppTheme;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  theme,
}: EmptyStateProps) {
  return (
    <View
      style={[
        styles.emptyState,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
        {title}
      </Text>
      <Text
        style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}
      >
        {description}
      </Text>
      {actionLabel && onAction ? (
        <AppButton
          title={actionLabel}
          onPress={onAction}
          theme={theme}
          variant="secondary"
        />
      ) : null}
    </View>
  );
}

type ErrorStateProps = {
  title: string;
  description: string;
  onRetry?: () => void;
  theme: AppTheme;
};

export function ErrorState({
  title,
  description,
  onRetry,
  theme,
}: ErrorStateProps) {
  return (
    <View
      style={[
        styles.emptyState,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.emptyTitle, { color: theme.colors.error }]}>
        {title}
      </Text>
      <Text
        style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}
      >
        {description}
      </Text>
      {onRetry ? (
        <AppButton
          title="Retry"
          onPress={onRetry}
          theme={theme}
          variant="secondary"
        />
      ) : null}
    </View>
  );
}

export function LoadingState({ theme }: { theme: AppTheme }) {
  return (
    <View
      style={[
        styles.loadingWrap,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
        Loading…
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    minHeight: 48,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyState: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  loadingWrap: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    alignItems: "center",
    marginTop: 14,
  },
});
