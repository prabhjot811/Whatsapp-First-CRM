import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton, Card } from "../../components/ui";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { Header } from "../../components/layout/Header";
import { reminderRules } from "../../mock/data";
import type { ReminderRule } from "../../types";
import { type RootStackParamList } from "../../navigation/types";
import { styles } from "../shared";
import type { ThemeProps } from "../shared";

export function ReminderAutomationScreen({
  navigation,
  theme,
}: NativeStackScreenProps<RootStackParamList, "ReminderAutomation"> &
  ThemeProps) {
  const [enabled, setEnabled] = useState(true);
  const [rules, setRules] = useState<ReminderRule[]>(() =>
    reminderRules.map((rule) => ({ ...rule })),
  );

  return (
    <ScreenWrapper theme={theme} scrollable>
      <Header
        title="Automatic Reminders"
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Automatic reminders help you follow up without having to remember every
        due date.
      </Text>
      <Card theme={theme}>
        <View style={styles.rowBetween}>
          <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
            Enable automatic reminders
          </Text>
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: enabled }}
            onPress={() => setEnabled((current) => !current)}
            style={[
              styles.toggle,
              {
                backgroundColor: enabled
                  ? theme.colors.primary
                  : theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                { marginLeft: enabled ? 26 : 4, backgroundColor: "#fff" },
              ]}
            />
          </Pressable>
        </View>
      </Card>
      {rules.map((rule) => (
        <Card key={rule.id} theme={theme}>
          <View style={styles.rowBetween}>
            <Text
              style={[styles.listTitle, { color: theme.colors.textPrimary }]}
            >
              {rule.label}
            </Text>
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{
                checked: rule.enabled,
                disabled: !enabled,
              }}
              disabled={!enabled}
              onPress={() =>
                setRules((current) =>
                  current.map((item) =>
                    item.id === rule.id
                      ? { ...item, enabled: !item.enabled }
                      : item,
                  ),
                )
              }
              style={[
                styles.toggle,
                {
                  backgroundColor: rule.enabled
                    ? theme.colors.primary
                    : theme.colors.border,
                  opacity: enabled ? 1 : 0.5,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  {
                    marginLeft: rule.enabled ? 26 : 4,
                    backgroundColor: "#fff",
                  },
                ]}
              />
            </Pressable>
          </View>
        </Card>
      ))}
      <AppButton
        title="Add Rule"
        onPress={() =>
          setRules((current) => {
            const daysAfter = current.length + 1;
            return [
              ...current,
              {
                id: `rule-${daysAfter}`,
                label: `${daysAfter} days after due date`,
                daysBeforeOrAfter: daysAfter,
                enabled: true,
              },
            ];
          })
        }
        theme={theme}
        variant="secondary"
      />
    </ScreenWrapper>
  );
}
