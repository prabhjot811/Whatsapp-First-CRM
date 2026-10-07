import { View } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { type CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SectionHeader } from "../../components/ui";
import { FinanceScreenBackground } from "../../components/layout/FinanceScreenBackground";
import { PaymentCard } from "../../components/composite/PaymentCard";
import { mockService } from "../../services/mockServices";
import { type AppTabParamList, type RootStackParamList } from "../../navigation/types";
import { styles, useRefreshOnFocus } from "../shared";
import type { ThemeProps } from "../shared";

export function PaymentHistoryScreen({
  navigation,
  theme,
}: (
  | CompositeScreenProps<
      BottomTabScreenProps<AppTabParamList, "Transactions">,
      NativeStackScreenProps<RootStackParamList>
    >
  | NativeStackScreenProps<RootStackParamList, "TransactionHistory">
) &
  ThemeProps) {
  useRefreshOnFocus();
  const payments = mockService.getPaymentHistory();

  return (
    <FinanceScreenBackground theme={theme}>
      <View style={[styles.listContainer, { backgroundColor: "transparent" }]}>
        <SectionHeader title="Payment history" theme={theme} />
        {payments.map((payment) => (
          <PaymentCard
            key={payment.id}
            payment={payment}
            customerName={
              mockService.getCustomer(payment.customerId)?.name ??
              "Unknown customer"
            }
            theme={theme}
          />
        ))}
      </View>
    </FinanceScreenBackground>
  );
}
