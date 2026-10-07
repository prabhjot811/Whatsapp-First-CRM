import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton, Card } from "../../components/ui";
import { FinanceScreenBackground } from "../../components/layout/FinanceScreenBackground";
import { notificationSettings } from "../../mock/data";
import { type RootStackParamList } from "../../navigation/types";
import { notificationOptions, styles } from "../shared";
import type { ThemeProps } from "../shared";

export function NotificationSettingsScreen({
  navigation,
  theme,
}: NativeStackScreenProps<RootStackParamList, "NotificationSettings"> &
  ThemeProps) {
  const [settings, setSettings] = useState(notificationSettings);

  const toggle = (key: keyof typeof settings) =>
    setSettings((current) => ({ ...current, [key]: !current[key] }));

  return (
    <FinanceScreenBackground theme={theme}>
      <View
        style={[
          styles.screen,
          { backgroundColor: "transparent", paddingHorizontal: 20 },
        ]}
      >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        Notifications
      </Text>
      {notificationOptions.map(({ key, label }) => (
        <Card key={key} theme={theme}>
          <View style={styles.rowBetween}>
            <Text
              style={[styles.listTitle, { color: theme.colors.textPrimary }]}
            >
              {label}
            </Text>
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: settings[key] }}
              onPress={() => toggle(key)}
              style={[
                styles.toggle,
                {
                  backgroundColor: settings[key]
                    ? theme.colors.primary
                    : theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  {
                    marginLeft: settings[key] ? 26 : 4,
                    backgroundColor: "#fff",
                  },
                ]}
              />
            </Pressable>
          </View>
        </Card>
      ))}
      <AppButton
        title="Back"
        onPress={() => navigation.goBack()}
        theme={theme}
        gradient
      />
      </View>
    </FinanceScreenBackground>
  );
}
