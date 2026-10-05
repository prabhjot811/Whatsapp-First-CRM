import React from "react";
import { Text, View } from "react-native";
import type { Transaction } from "../../types";
import { formatDate } from "../../utils/dateFormatter";
import type { AppTheme } from "../../theme/theme";
import { Card } from "../ui";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";

interface TransactionCardProps {
  transaction: Transaction;
  customerName: string;
  theme: AppTheme;
}

export function TransactionCard({
  transaction,
  customerName,
  theme,
}: TransactionCardProps) {
  const formatMoney = useCurrencyFormatter();
  const isCredit = transaction.type === "credit";

  return (
    <Card theme={theme}>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.colors.textPrimary, fontWeight: "700" }}>
            {customerName}
          </Text>
          <Text style={{ color: theme.colors.textSecondary, marginTop: 5 }}>
            {transaction.description}
          </Text>
          <Text style={{ color: theme.colors.textSecondary, marginTop: 4 }}>
            {formatDate(transaction.createdAt)}
            {transaction.dueDate ? ` · Due ${formatDate(transaction.dueDate)}` : ""}
          </Text>
        </View>
        <Text
          style={{
            color: isCredit ? theme.colors.primary : theme.colors.success,
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          {isCredit ? "+" : "−"}
          {formatMoney(transaction.amount)}
        </Text>
      </View>
    </Card>
  );
}
