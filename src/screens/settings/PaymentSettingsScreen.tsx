import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton, Card } from "../../components/ui";
import { FinanceScreenBackground } from "../../components/layout/FinanceScreenBackground";
import { type RootStackParamList } from "../../navigation/types";
import { styles } from "../shared";
import type { ThemeProps } from "../shared";

export function PaymentSettingsScreen({
  navigation,
  theme,
}: NativeStackScreenProps<RootStackParamList, "PaymentSettings"> & ThemeProps) {
  return (
    <FinanceScreenBackground theme={theme}>
      <View
        style={[
          styles.screen,
          { backgroundColor: "transparent", paddingHorizontal: 20 },
        ]}
      >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        Payment Settings
      </Text>
      <Card theme={theme}>
        <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
          UPI
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          Bank transfer • Card
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
