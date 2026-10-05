import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import type { AppTheme } from "../../theme/theme";

interface PhoneInputProps {
  label: string;
  value: string;
  onChangeText(value: string): void;
  theme: AppTheme;
  placeholder?: string;
}

export function PhoneInput({
  label,
  value,
  onChangeText,
  theme,
  placeholder = "+91 98765 43210",
}: PhoneInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        autoComplete="tel"
        keyboardType="phone-pad"
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.textPrimary,
          },
        ]}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 14,
  },
});
