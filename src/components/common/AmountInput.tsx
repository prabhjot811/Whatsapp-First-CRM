import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import type { CurrencyCode } from "../../types";
import { currencySymbols } from "../../utils/currencyFormatter";
import type { AppTheme } from "../../theme/theme";
import { useBusiness } from "../../hooks/useBusiness";

interface AmountInputProps {
  label: string;
  value: string;
  onChangeText(value: string): void;
  theme: AppTheme;
  currency?: CurrencyCode;
  placeholder?: string;
}

export function AmountInput({
  label,
  value,
  onChangeText,
  theme,
  currency,
  placeholder = "0.00",
}: AmountInputProps) {
  const { business } = useBusiness();
  const selectedCurrency = currency ?? business.currency;
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.symbol, { color: theme.colors.textSecondary }]}>
          {currencySymbols[selectedCurrency]}
        </Text>
        <TextInput
          accessibilityLabel={label}
          keyboardType="decimal-pad"
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          style={[styles.input, { color: theme.colors.textPrimary }]}
          value={value}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  inputWrapper: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 52,
    paddingHorizontal: 14,
  },
  symbol: { fontSize: 16, fontWeight: "600", marginRight: 8 },
  input: { flex: 1, fontSize: 16, paddingVertical: 12 },
});
