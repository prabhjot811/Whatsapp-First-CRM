import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { AppButton } from "../../components/ui";
import { getErrorMessage } from "../../utils/errorHandler";
import { useAuth } from "../../hooks/useAuth";
import { styles } from "../shared";
import type { LoginScreenProps } from "../shared";

export function LoginScreen({ navigation, theme }: LoginScreenProps) {
  const { requestOtp } = useAuth();
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("98765 43210");
  const [error, setError] = useState("");

  const handleContinue = () => {
    const cleaned = phoneNumber.replace(/\s+/g, "");
    if (!cleaned || cleaned.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }
    const phone = `${countryCode} ${cleaned}`.trim();
    try {
      requestOtp(phone);
      setError("");
      navigation.navigate("Otp", { phoneNumber: phone });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background, paddingHorizontal: 20 },
      ]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        Login
      </Text>
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Phone number
      </Text>
      <View style={styles.inlineFields}>
        <TextInput
          value={countryCode}
          onChangeText={setCountryCode}
          style={[
            styles.countryInput,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.textPrimary,
            },
          ]}
        />
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholder="Phone number"
          style={[
            styles.phoneInput,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.textPrimary,
            },
          ]}
        />
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
      <AppButton title="Continue" onPress={handleContinue} theme={theme} />
    </View>
  );
}

export { LoginScreen as PhoneLoginScreen };
