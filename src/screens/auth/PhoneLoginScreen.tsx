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

type PhoneLengthGroup = {
  iso2Codes: string;
  lengths: readonly number[];
};

// National mobile-number lengths exclude the international dialing code.
const phoneLengthGroups: readonly PhoneLengthGroup[] = [
  { lengths: [5], iso2Codes: "CK FK SH" },
  { lengths: [6], iso2Codes: "FO GL NC NF WF" },
  {
    lengths: [7],
    iso2Codes: "AW BZ IO BN CV KM ER FJ GY MV MH FM NR PW ST SC SR TO VU",
  },
  {
    lengths: [8],
    iso2Codes:
      "AM BH BT BO BW BF BI CF TD CR CU CY DK DJ TL SV SZ PF GI GT HT HN HK KI XK KW LV LS LT MO ML MT MR MU MD MN ME NI NE MK NO OM PG QA SM SL SG SI SJ TG TN TM UY",
  },
  {
    lengths: [9],
    iso2Codes:
      "AF AL DZ AO AU AZ BY BE CM CL CX CC CZ EC GQ ET FR GF GE GH GP GN GW HU IE IL JO KE KG LY LU MG MW MQ YT MA MZ NA PS PY PE PL PT CG RE RO RW BL MF SA SN SK SS ES LK SD SE CH SY TW TJ TZ TH UG UA AE UZ VN EH YE ZM ZW",
  },
  {
    lengths: [10],
    iso2Codes:
      "AS AI AG BS BD BB BJ BM VG CA KY CO DM DO EG GR GD GU GG IN IR IQ IM CI JM JP JE KZ MX MS NP NG KP MP PK PH PR RU KN LC VC SX TT TR TC VI GB US VE",
  },
  { lengths: [11], iso2Codes: "CN" },
  { lengths: [6, 9], iso2Codes: "AD PM" },
  { lengths: [10, 11], iso2Codes: "AR BR DE" },
  { lengths: [7, 8, 9, 10, 11, 12, 13], iso2Codes: "AT" },
  { lengths: [8, 9], iso2Codes: "BA BG KH HR MC" },
  { lengths: [7, 8], iso2Codes: "CW EE GA LB PA" },
  { lengths: [7, 9], iso2Codes: "CD GM IS LR LI" },
  { lengths: [6, 7, 8, 9, 10], iso2Codes: "FI" },
  { lengths: [9, 10, 11, 12], iso2Codes: "ID" },
  { lengths: [9, 10], iso2Codes: "IT LA MY KR VA" },
  { lengths: [7, 8, 9, 10], iso2Codes: "MM" },
  { lengths: [9, 11], iso2Codes: "NL" },
  { lengths: [8, 9, 10], iso2Codes: "NZ PN RS" },
  { lengths: [4, 7], iso2Codes: "NU" },
  { lengths: [7, 10], iso2Codes: "WS" },
  { lengths: [5, 7], iso2Codes: "SB" },
  { lengths: [7, 8, 9], iso2Codes: "SO" },
  { lengths: [5, 6, 7, 8, 9], iso2Codes: "ZA" },
  { lengths: [4, 5, 6, 7], iso2Codes: "TK" },
  { lengths: [6, 7], iso2Codes: "TV" },
];

const phoneLengthsByCountry: Record<string, readonly number[]> = {};
for (const group of phoneLengthGroups) {
  for (const iso2 of group.iso2Codes.split(" ")) {
    phoneLengthsByCountry[iso2] = group.lengths;
  }
}

function getPhoneNumberLengthError(country: Country, value: string) {
  const lengths = phoneLengthsByCountry[country.iso2];
  if (!lengths) {
    return `Phone number length rules are unavailable for ${country.name}.`;
  }

  const digits = value.replace(/\D/g, "");
  if (lengths.includes(digits.length)) return "";

  if (lengths.length === 1) {
    return `Please enter a valid ${lengths[0]}-digit phone number for ${country.name}.`;
  }

  const isContinuous =
    lengths.length === Math.max(...lengths) - Math.min(...lengths) + 1;
  const acceptedLengths = isContinuous
    ? `${Math.min(...lengths)}-${Math.max(...lengths)} digits`
    : `${lengths.join(", ")} digits`;
  return `Please enter a valid phone number for ${country.name} (${acceptedLengths}).`;
}

export function LoginScreen({ navigation, theme }: LoginScreenProps) {
  const { requestOtp } = useAuth();
  const { height, width } = useWindowDimensions();
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    () => countries.find((country) => country.iso2 === "IN") ?? countries[0],
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const scale = Math.min(
    Math.max(Math.min(width / 390, height / 720), 0.84),
    1.12,
  );
  const illustrationSize = Math.min(width * 0.74, height * 0.36, 290);
  const handleContinue = () => {
    const digits = phoneNumber.replace(/\D/g, "");
    const validationError = getPhoneNumberLengthError(
      selectedCountry,
      phoneNumber,
    );
    setPhoneTouched(true);
    if (validationError) {
      setError(validationError);
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
                    fontSize: (typography.h1 + 2) * scale,
                    lineHeight: (typography.h1 + 2) * scale * 1.16,
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
                    fontSize: (typography.h1 + 2) * scale,
                    lineHeight: (typography.h1 + 2) * scale * 1.16,
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
                  setPhoneTouched(false);
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
                  if (phoneTouched) {
                    setError(getPhoneNumberLengthError(selectedCountry, value));
                  } else if (error) {
                    setError("");
                  }
                }}
                onBlur={() => {
                  setPhoneTouched(true);
                  setError(
                    getPhoneNumberLengthError(selectedCountry, phoneNumber),
                  );
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
    paddingLeft: 12,
    paddingVertical: 0,
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
