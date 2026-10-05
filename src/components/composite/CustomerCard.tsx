import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Customer } from "../../types";
import type { AppTheme } from "../../theme/theme";
import { Card, StatusBadge } from "../ui";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";

interface CustomerCardProps {
  customer: Customer;
  balance: number;
  overdueBalance: number;
  dueTodayBalance: number;
  theme: AppTheme;
  onPress(): void;
}

export function CustomerCard({
  customer,
  balance,
  overdueBalance,
  dueTodayBalance,
  theme,
  onPress,
}: CustomerCardProps) {
  const formatMoney = useCurrencyFormatter();
  const isPaid = balance === 0;
  const status = isPaid
    ? "Paid"
    : overdueBalance > 0
      ? "Overdue"
      : dueTodayBalance > 0
        ? "Due today"
        : "Pending";
  const tone = isPaid
    ? "success"
    : overdueBalance > 0 || dueTodayBalance > 0
      ? "warning"
      : "info";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <Card theme={theme}>
        <View style={styles.row}>
          <View style={styles.identity}>
            <Text
              numberOfLines={1}
              style={[styles.name, { color: theme.colors.textPrimary }]}
            >
              {customer.name}
            </Text>
            <Text style={[styles.phone, { color: theme.colors.textSecondary }]}>
              {customer.phone}
            </Text>
          </View>
          <Text
            style={[
              styles.amount,
              { color: isPaid ? theme.colors.success : theme.colors.primary },
            ]}
          >
            {formatMoney(balance)}
          </Text>
        </View>
        <View style={styles.row}>
          <StatusBadge label={status} tone={tone} theme={theme} />
          <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
            {overdueBalance > 0
              ? `${formatMoney(overdueBalance)} overdue`
              : dueTodayBalance > 0
                ? `${formatMoney(dueTodayBalance)} due today`
              : isPaid
                ? "No outstanding balance"
                : "Not yet overdue"}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  identity: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700" },
  phone: { fontSize: 13, marginTop: 5 },
  amount: { fontSize: 16, fontWeight: "700" },
  meta: { fontSize: 12, marginTop: 10 },
});
