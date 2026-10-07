import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton, Card } from "../../components/ui";
import { FinanceScreenBackground } from "../../components/layout/FinanceScreenBackground";
import { reminderTemplates } from "../../mock/data";
import { type RootStackParamList } from "../../navigation/types";
import { styles } from "../shared";
import type { ThemeProps } from "../shared";

export function ReminderTemplateScreen({
  navigation,
  theme,
}: NativeStackScreenProps<RootStackParamList, "ReminderTemplate"> &
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
        Reminder Templates
      </Text>
      {reminderTemplates.map((template) => (
        <Card key={template.id} theme={theme}>
          <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
            {template.name}
          </Text>
          <Text
            style={[styles.listMeta, { color: theme.colors.textSecondary }]}
          >
            {template.content}
          </Text>
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
