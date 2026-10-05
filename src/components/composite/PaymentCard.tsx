import React from "react";
import { Text, View } from "react-native";
import type { Payment } from "../../types";
import { formatDate } from "../../utils/dateFormatter";
import type { AppTheme } from "../../theme/theme";
import { Card, StatusBadge } from "../ui";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";

interface PaymentCardProps {
  payment: Payment;
  customerName: string;
  theme: AppTheme;
}

export function PaymentCard({
  payment,
  customerName,
  theme,
}: PaymentCardProps) {
  const formatMoney = useCurrencyFormatter();
  const tone =
    payment.status === "successful"
      ? "success"
      : payment.status === "failed"
        ? "error"
        : "warning";

  return (
    <Card theme={theme}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: theme.colors.textPrimary, fontWeight: "700" }}>
          {customerName}
        </Text>
        <Text style={{ color: theme.colors.success, fontWeight: "700" }}>
          {formatMoney(payment.amount)}
        </Text>
      </View>
      <Text style={{ color: theme.colors.textSecondary, marginTop: 6 }}>
        {payment.paymentMethod} · {payment.reference}
      </Text>
      <Text style={{ color: theme.colors.textSecondary, marginVertical: 6 }}>
        {formatDate(payment.createdAt)}
      </Text>
      <StatusBadge label={payment.status} tone={tone} theme={theme} />
    </Card>
  );
}
