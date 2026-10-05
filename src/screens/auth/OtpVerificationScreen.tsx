import { useEffect, useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import { AppButton } from "../../components/ui";
import { getErrorMessage } from "../../utils/errorHandler";
import { useAuth } from "../../hooks/useAuth";
import { styles } from "../shared";
import type { OtpScreenProps } from "../shared";

export function OtpScreen({ navigation, route, theme }: OtpScreenProps) {
  const { requestOtp, verifyOtp } = useAuth();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const phoneNumber = route.params.phoneNumber;

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(
      () => setTimer((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError("Enter the 6-digit verification code.");
      return;
    }
    try {
      verifyOtp(phoneNumber, otp);
      setError("");
      navigation.navigate("BusinessSetup");
    } catch (verificationError) {
      setError(getErrorMessage(verificationError));
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
        Verify OTP
      </Text>
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Sent to {phoneNumber}
      </Text>
      <TextInput
        value={otp}
        onChangeText={(text) => setOtp(text.replace(/\D/g, "").slice(0, 6))}
        keyboardType="number-pad"
        placeholder="Enter 6-digit OTP"
        maxLength={6}
        style={[
          styles.otpInput,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.textPrimary,
          },
        ]}
      />
      <View style={styles.rowBetween}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={[styles.secondaryText, { color: theme.colors.primary }]}>
            Edit phone number
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            try {
              requestOtp(phoneNumber);
              setOtp("");
              setError("");
              setTimer(30);
            } catch (requestError) {
              setError(getErrorMessage(requestError));
            }
          }}
          disabled={timer > 0}
        >
          <Text
            style={[
              styles.secondaryText,
              {
                color:
                  timer > 0 ? theme.colors.textSecondary : theme.colors.primary,
              },
            ]}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
          </Text>
        </Pressable>
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
      <AppButton
        title="Verify"
        onPress={handleVerify}
        theme={theme}
        disabled={otp.length !== 6}
      />
    </View>
  );
}

export { OtpScreen as OtpVerificationScreen };
