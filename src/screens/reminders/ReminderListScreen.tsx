import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { type CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SectionHeader } from "../../components/ui";
import { FinanceScreenBackground } from "../../components/layout/FinanceScreenBackground";
import { ReminderCard } from "../../components/composite/ReminderCard";
import { mockService } from "../../services/mockServices";
import { type AppTabParamList, type RootStackParamList } from "../../navigation/types";
import { reminderFilters, styles, useRefreshOnFocus } from "../shared";
import type { ReminderFilter, ThemeProps } from "../shared";

export function ReminderHistoryScreen({
  navigation,
  theme,
}: (
  | CompositeScreenProps<
      BottomTabScreenProps<AppTabParamList, "Reminders">,
      NativeStackScreenProps<RootStackParamList>
    >
  | NativeStackScreenProps<RootStackParamList, "ReminderHistory">
) &
  ThemeProps) {
  useRefreshOnFocus();
  const [filter, setFilter] = useState<ReminderFilter>("All");
  const reminderList = mockService.getReminders();
  const filtered = reminderList.filter(
    (item) => filter === "All" || item.status === filter.toLowerCase(),
  );

  return (
    <FinanceScreenBackground theme={theme}>
      <View style={[styles.listContainer, { backgroundColor: "transparent" }]}>
        <SectionHeader title="Reminder history" theme={theme} />
        <View style={styles.filterRow}>
          {reminderFilters.map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    filter === item ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === item ? "#fff" : theme.colors.textPrimary },
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
        {filtered.map((reminder) => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            customerName={
              mockService.getCustomer(reminder.customerId)?.name ??
              "Unknown customer"
            }
            theme={theme}
          />
        ))}
      </View>
    </FinanceScreenBackground>
  );
}

export { ReminderHistoryScreen as ReminderListScreen };
