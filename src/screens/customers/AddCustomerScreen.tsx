import { useState } from "react";
import { Text } from "react-native";
import { AppButton, InputField } from "../../components/ui";
import { PhoneInput } from "../../components/common/PhoneInput";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { Header } from "../../components/layout/Header";
import { mockService } from "../../services/mockServices";
import { appConfig } from "../../constants/config";
import { isValidEmail, isValidPhone } from "../../utils/validators";
import { getErrorMessage } from "../../utils/errorHandler";
import { styles } from "../shared";
import type { AddCustomerScreenProps } from "../shared";

export function AddCustomerScreen({
  navigation,
  theme,
}: AddCustomerScreenProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("Enter a valid phone number.");
      return;
    }
    if (email.trim() && !isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    try {
      mockService.createCustomer({
        businessId: appConfig.businessId,
        name,
        phone,
        email,
        notes,
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
        title="Add Customer"
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <InputField
        label="Full Name"
        placeholder="Customer name"
        value={name}
        onChangeText={setName}
        theme={theme}
      />
      <PhoneInput
        label="Phone Number"
        placeholder="+91 98765 43210"
        value={phone}
        onChangeText={setPhone}
        theme={theme}
      />
      <InputField
        label="Email (optional)"
        placeholder="customer@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        theme={theme}
      />
      <InputField
        label="Notes (optional)"
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
      <AppButton
        title="Save Customer"
        onPress={handleSave}
        theme={theme}
        gradient
      />
    </ScreenWrapper>
  );
}
