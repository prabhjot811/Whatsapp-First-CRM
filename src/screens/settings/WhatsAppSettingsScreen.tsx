import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton, Card, StatusBadge } from "../../components/ui";
import { FinanceScreenBackground } from "../../components/layout/FinanceScreenBackground";
import { reminderTemplates } from "../../mock/data";
import { type RootStackParamList } from "../../navigation/types";
import { styles } from "../shared";
import type { ThemeProps } from "../shared";

export function WhatsAppSettingsScreen({
  navigation,
  theme,
}: NativeStackScreenProps<RootStackParamList, "WhatsAppSettings"> &
  ThemeProps) {
  return (
    <FinanceScreenBackground theme={theme}>
      <View
        style={[
          styles.screen,
          { backgroundColor: "transparent", paddingHorizontal: 20 },
        ]}
      >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        WhatsApp Settings
      </Text>
      <Card theme={theme}>
        <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
          Connection status
        </Text>
        <StatusBadge label="Connected" tone="success" theme={theme} />
      </Card>
      <Card theme={theme}>
        <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
          Templates
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          {reminderTemplates.length} available
        </Text>
      </Card>
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
