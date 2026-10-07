import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientActionButton } from "../../components/common/GradientActionButton";
import { AuthScreenBackground } from "../../components/layout/AuthScreenBackground";
import { typography } from "../../constants/typography";
import { getErrorMessage } from "../../utils/errorHandler";
import { useAuth } from "../../hooks/useAuth";
import { CountryCodePicker } from "./CountryCodePicker";
import { PhoneLoginIllustration } from "./PhoneLoginIllustration";
import { countries, type Country } from "./countries";
import type { LoginScreenProps } from "../shared";

export function LoginScreen({ navigation, theme }: LoginScreenProps) {
  const { requestOtp } = useAuth();
  const { height, width } = useWindowDimensions();
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    () => countries.find((country) => country.iso2 === "IN") ?? countries[0],
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const scale = Math.min(
    Math.max(Math.min(width / 390, height / 720), 0.84),
    1.12,
  );
  const illustrationSize = Math.min(width * 0.74, height * 0.36, 290);
  const maxNationalDigits = 15 - selectedCountry.dialCode.length;

  const handleContinue = () => {
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length < 6 || digits.length > maxNationalDigits) {
      setError(
        `Enter a valid phone number with 6 to ${maxNationalDigits} digits.`,
      );
      return;
    }
    const phone = `+${selectedCountry.dialCode} ${digits}`;
    try {
      requestOtp(phone);
      setError("");
      navigation.navigate("Otp", { phoneNumber: phone });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <AuthScreenBackground theme={theme}>
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={10}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={theme.colors.textPrimary}
          />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.flex}
        >
          <View style={styles.content}>
            <View style={{ marginBottom: 14 * scale }}>
              <Text
                style={[
                  styles.headingLine,
                  {
                    color: theme.colors.textPrimary,
                    fontSize: typography.h1 * scale,
                    lineHeight: typography.h1 * scale * 1.16,
                    fontWeight: "800",
                  },
                ]}
              >
                Login with your
              </Text>
              <Text
                style={[
                  styles.headingLine,
                  {
                    color: theme.colors.textPrimary,
                    fontSize: typography.h1 * scale,
                    lineHeight: typography.h1 * scale * 1.16,
                    fontWeight: "800",
                  },
                ]}
              >
                Phone Number
              </Text>
            </View>

            <View
              style={[
                styles.phoneField,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.sm,
                },
              ]}
            >
              <CountryCodePicker
                selectedCountry={selectedCountry}
                onSelect={(country) => {
                  setSelectedCountry(country);
                  setError("");
                }}
                theme={theme}
              />
              <TextInput
                accessibilityLabel={`Phone number for ${selectedCountry.name}`}
                autoComplete="tel-national"
                autoCorrect={false}
                keyboardType="phone-pad"
                maxLength={20}
                onChangeText={(value) => {
                  setPhoneNumber(value);
                  if (error) setError("");
                }}
                placeholder={
                  selectedCountry.iso2 === "IN"
                    ? "98765 43210"
                    : "Phone number"
                }
                placeholderTextColor={theme.colors.textSecondary}
                returnKeyType="done"
                style={[
                  styles.phoneInput,
                  {
                    color: theme.colors.textPrimary,
                    fontSize: typography.bodySmall * scale,
                  },
                ]}
                value={phoneNumber}
              />
            </View>

            <Text
              style={[
                styles.helperText,
                {
                  color: theme.colors.textSecondary,
                  fontSize: typography.caption * scale,
                  lineHeight: 17 * scale,
                  marginTop: 9 * scale,
                },
              ]}
            >
              We&apos;ll send an OTP to verify your number
            </Text>

            {error ? (
              <Text
                accessibilityLiveRegion="polite"
                style={[
                  styles.errorText,
                  {
                    color: theme.colors.error,
                    fontSize: typography.caption * scale,
                  },
                ]}
              >
                {error}
              </Text>
            ) : null}

            <View style={{ marginTop: 10 * scale }}>
              <GradientActionButton
                title="Continue"
                onPress={handleContinue}
                theme={theme}
                fontSize={typography.label * scale}
                minHeight={56 * scale}
              />
            </View>

          </View>

          <View
            style={[
              styles.illustrationArea,
              {
                marginTop: 18 * scale,
                minHeight: illustrationSize,
                paddingBottom: 4 * scale,
              },
            ]}
          >
            <PhoneLoginIllustration
              theme={theme}
              size={illustrationSize}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthScreenBackground>
  );
}

export { LoginScreen as PhoneLoginScreen };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: "5%",
    paddingBottom: 4,
    backgroundColor: "transparent",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  header: {
    height: 40,
    justifyContent: "center",
  },
  backButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    marginLeft: -8,
    width: 40,
  },
  content: {
    paddingTop: 12,
  },
  headingLine: {
    fontWeight: "700",
  },
  phoneField: {
    alignItems: "center",
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 54,
    paddingHorizontal: 12,
  },
  phoneInput: {
    flex: 1,
    minHeight: 50,
    padding: 0,
  },
  errorText: {
    marginTop: 6,
  },
  helperText: {
    textAlign: "center",
  },
  illustrationArea: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
