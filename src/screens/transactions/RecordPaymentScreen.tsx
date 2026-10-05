import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { AppButton, Card, InputField } from "../../components/ui";
import { AmountInput } from "../../components/common/AmountInput";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { Header } from "../../components/layout/Header";
import { mockService } from "../../services/mockServices";
import { getAmountError } from "../../utils/validators";
import { parseAmount } from "../../utils/currencyFormatter";
import { getErrorMessage } from "../../utils/errorHandler";
import type { PaymentMethod } from "../../types";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";
import { paymentMethodLabel, paymentMethods, styles } from "../shared";
import type { RecordPaymentScreenProps } from "../shared";

export function RecordPaymentScreen({
  route,
  navigation,
  theme,
}: RecordPaymentScreenProps) {
  const formatMoney = useCurrencyFormatter();
  const customer = mockService.getCustomer(route.params.customerId);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("UPI");
  const [reference, setReference] = useState("PAY-2026");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const outstanding = mockService.getCustomerOutstandingBalance(
    route.params.customerId,
  );
  const parsedAmount = parseAmount(amount);
  const remaining = Math.max(0, outstanding - (parsedAmount ?? 0));
  const amountError = getAmountError(amount);
  const exceedsBalance = parsedAmount !== null && parsedAmount > outstanding;

  const handleSave = () => {
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
        `Payment cannot exceed the outstanding balance of ${formatMoney(outstanding)}.`,
      );
      return;
    }
    try {
      mockService.recordPayment({
        businessId: customer.businessId,
        customerId: customer.id,
        amount: parsedAmount,
        paymentMethod: method,
        status: "successful",
        reference: reference.trim(),
        notes: notes.trim() || undefined,
      });
      setError("");
      navigation.goBack();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  };

  return (
    <ScreenWrapper theme={theme} scrollable>
      <Header
        title="Record Payment"
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
        Customer: {customer?.name}
      </Text>
      <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
        Outstanding: {formatMoney(outstanding)}
      </Text>
      <AmountInput
        label="Amount"
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        theme={theme}
      />
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Payment method
      </Text>
      <View style={styles.filterRow}>
        {paymentMethods.map((paymentMethod) => (
          <Pressable
            key={paymentMethod}
            accessibilityRole="button"
            accessibilityState={{ selected: method === paymentMethod }}
            onPress={() => setMethod(paymentMethod)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  method === paymentMethod
                    ? theme.colors.primary
                    : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    method === paymentMethod
                      ? "#fff"
                      : theme.colors.textPrimary,
                },
              ]}
            >
              {paymentMethodLabel[paymentMethod]}
            </Text>
          </Pressable>
        ))}
      </View>
      <InputField
        label="Reference number"
        placeholder="REF-100"
        value={reference}
        onChangeText={setReference}
        theme={theme}
      />
      <InputField
        label="Notes"
        placeholder="Optional notes"
        value={notes}
        onChangeText={setNotes}
        theme={theme}
        multiline
      />
      <Card theme={theme}>
        <Text
          style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
        >
          Remaining
        </Text>
        <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
          {formatMoney(remaining)}
        </Text>
      </Card>
      {error || (amount.length > 0 && (amountError || exceedsBalance)) ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error ||
            (exceedsBalance
              ? "Payment cannot exceed the outstanding balance."
              : amountError)}
        </Text>
      ) : null}
      <AppButton
        title="Save Payment"
        onPress={handleSave}
        theme={theme}
        disabled={amountError !== null || exceedsBalance || outstanding <= 0}
      />
    </ScreenWrapper>
  );
}
