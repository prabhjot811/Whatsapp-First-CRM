import { useState } from "react";
import { Text } from "react-native";
import { AppButton, Card, InputField } from "../../components/ui";
import { AmountInput } from "../../components/common/AmountInput";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { Header } from "../../components/layout/Header";
import { mockService } from "../../services/mockServices";
import { getAmountError } from "../../utils/validators";
import { parseAmount } from "../../utils/currencyFormatter";
import { getErrorMessage } from "../../utils/errorHandler";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";
import { styles } from "../shared";
import type { PaymentLinkScreenProps } from "../shared";

export function PaymentLinkScreen({
  route,
  navigation,
  theme,
}: PaymentLinkScreenProps) {
  const formatMoney = useCurrencyFormatter();
  const customer = mockService.getCustomer(route.params.customerId);
  const balance = mockService.getCustomerOutstandingBalance(
    route.params.customerId,
  );
  const [amount, setAmount] = useState(String(balance));
  const [description, setDescription] = useState("Outstanding balance");
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState("");
  const parsedAmount = parseAmount(amount);
  const amountError = getAmountError(amount);
  const exceedsBalance = parsedAmount !== null && parsedAmount > balance;

  const createLink = () => {
    if (!customer) {
      setError("Customer could not be found.");
      return;
    }
    if (amountError || parsedAmount === null) {
      setError(amountError ?? "Enter a valid amount.");
      return;
    }
    if (exceedsBalance) {
      setError(
        `Payment link cannot exceed the outstanding balance of ${formatMoney(balance)}.`,
      );
      return;
    }
    try {
      const paymentLink = mockService.generatePaymentLink(
        customer.id,
        parsedAmount,
        description.trim() || "Outstanding balance",
      );
      setLink(paymentLink.url);
      setError("");
    } catch (linkError) {
      setError(getErrorMessage(linkError));
    }
  };

  return (
    <ScreenWrapper theme={theme} scrollable>
      <Header
        title="Generate Payment Link"
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
        Customer: {customer?.name}
      </Text>
      <AmountInput
        label="Amount"
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        theme={theme}
      />
      <InputField
        label="Description"
        placeholder="Outstanding payment"
        value={description}
        onChangeText={setDescription}
        theme={theme}
      />
      <AppButton
        title="Generate Payment Link"
        onPress={createLink}
        theme={theme}
        disabled={!parsedAmount || exceedsBalance}
      />
      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
      {link ? (
        <Card theme={theme}>
          <Text
            style={[styles.listMeta, { color: theme.colors.textSecondary }]}
            selectable
          >
            {link}
          </Text>
          <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
            Select and copy this link to share it with the customer.
          </Text>
        </Card>
      ) : null}
    </ScreenWrapper>
  );
}
