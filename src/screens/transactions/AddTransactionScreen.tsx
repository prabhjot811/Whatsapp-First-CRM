import { useState } from "react";
import { Text } from "react-native";
import { AppButton, InputField } from "../../components/ui";
import { AmountInput } from "../../components/common/AmountInput";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { Header } from "../../components/layout/Header";
import { mockService } from "../../services/mockServices";
import { appConfig } from "../../constants/config";
import { toIsoDate } from "../../utils/dateFormatter";
import { getAmountError } from "../../utils/validators";
import { parseAmount } from "../../utils/currencyFormatter";
import { getErrorMessage } from "../../utils/errorHandler";
import { styles } from "../shared";
import type { AddDueScreenProps } from "../shared";

export function AddDueScreen({ route, navigation, theme }: AddDueScreenProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const value = parseAmount(amount);
    const validDueDate = toIsoDate(dueDate);
    if (!value) {
      setError(getAmountError(amount) ?? "Enter a valid amount.");
      return;
    }
    if (!validDueDate) {
      setError("Enter a valid due date in YYYY-MM-DD format.");
      return;
    }
    try {
      mockService.addTransaction({
        businessId: appConfig.businessId,
        customerId: route.params.customerId,
        type: "credit",
        amount: value,
        description: description.trim() || "Due added",
        reference: reference.trim() || `INV-${Date.now()}`,
        dueDate: validDueDate,
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
        title="Add Due"
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <AmountInput
        label="Amount"
        placeholder="₹10,000"
        value={amount}
        onChangeText={setAmount}
        theme={theme}
      />
      <InputField
        label="Description"
        placeholder="Invoice or product description"
        value={description}
        onChangeText={setDescription}
        theme={theme}
      />
      <InputField
        label="Invoice / reference number"
        placeholder="INV-1024"
        value={reference}
        onChangeText={setReference}
        theme={theme}
      />
      <InputField
        label="Due date"
        placeholder="2026-10-10"
        value={dueDate}
        onChangeText={setDueDate}
        theme={theme}
      />
      <InputField
        label="Optional notes"
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        theme={theme}
        multiline
      />
      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
      <AppButton title="Save" onPress={handleSave} theme={theme} gradient />
    </ScreenWrapper>
  );
}

export { AddDueScreen as AddTransactionScreen };
