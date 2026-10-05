import React from "react";
import { Text, View } from "react-native";
import type { Reminder } from "../../types";
import { formatDate } from "../../utils/dateFormatter";
import type { AppTheme } from "../../theme/theme";
import { Card, StatusBadge } from "../ui";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";

interface ReminderCardProps {
  reminder: Reminder;
  customerName: string;
  theme: AppTheme;
}

export function ReminderCard({
  reminder,
  customerName,
  theme,
}: ReminderCardProps) {
  const formatMoney = useCurrencyFormatter();
  const tone =
    reminder.status === "failed"
      ? "error"
      : reminder.status === "read"
        ? "success"
        : reminder.status === "queued"
          ? "warning"
          : "info";

  return (
    <Card theme={theme}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: theme.colors.textPrimary, fontWeight: "700" }}>
          {customerName}
        </Text>
        <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>
          {formatMoney(reminder.amount)}
        </Text>
      </View>
      <Text style={{ color: theme.colors.textSecondary, marginVertical: 6 }}>
        {formatDate(reminder.scheduledAt)} · {reminder.channel}
      </Text>
      <StatusBadge
        label={reminder.status}
        tone={tone}
        theme={theme}
      />
    </Card>
  );
}
