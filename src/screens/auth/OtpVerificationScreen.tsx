import { useEffect, useRef, useState } from "react";
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
import { PhoneLoginIllustration } from "./PhoneLoginIllustration";
import type { OtpScreenProps } from "../shared";

const OTP_LENGTH = 6;
const RESEND_DELAY_SECONDS = 120;

export function OtpScreen({ navigation, route, theme }: OtpScreenProps) {
  const { requestOtp, verifyOtp } = useAuth();
  const { height, width } = useWindowDimensions();
  const inputRef = useRef<TextInput>(null);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(RESEND_DELAY_SECONDS);
  const [error, setError] = useState("");
  const phoneNumber = route.params.phoneNumber;
  const isCountingDown = timer > 0;
  const scale = Math.min(
    Math.max(Math.min(width / 390, height / 720), 0.84),
    1.12,
  );
  const compact = height < 600;
  const illustrationSize = Math.min(
    width * 0.64,
    height * (compact ? 0.2 : 0.31),
    248,
  );

  useEffect(() => {
    if (!isCountingDown) return;
    const interval = setInterval(
      () => setTimer((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => clearInterval(interval);
  }, [isCountingDown]);

  const minutes = Math.floor(timer / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timer % 60).toString().padStart(2, "0");

  const handleVerify = () => {
    if (otp.length !== OTP_LENGTH) {
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

  const handleResend = () => {
    try {
      requestOtp(phoneNumber);
      setOtp("");
      setError("");
      setTimer(RESEND_DELAY_SECONDS);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <AuthScreenBackground theme={theme}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={theme.colors.textPrimary}
            />
          </Pressable>
          <View
            style={[
              styles.secureBadge,
              { backgroundColor: `${theme.colors.primary}12` },
            ]}
          >
            <Ionicons
              name="shield-checkmark"
              size={15}
              color={theme.colors.primary}
            />
            <Text style={[styles.secureText, { color: theme.colors.primary }]}>
              Secure verification
            </Text>
          </View>
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
          >
            <View style={[styles.content, { paddingTop: 12 * scale }]}>
              <View
                style={[
                  styles.iconBadge,
                  {
                    backgroundColor: `${theme.colors.primary}12`,
                    borderColor: `${theme.colors.primary}20`,
                    height: 48 * scale,
                    marginBottom: 12 * scale,
                    width: 48 * scale,
                  },
                ]}
              >
                <Ionicons
                  name="chatbubble-ellipses"
                  size={22 * scale}
                  color={theme.colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.colors.textPrimary,
                    fontSize: typography.h1 * scale,
                    lineHeight: typography.h1 * scale * 1.18,
                  },
                ]}
              >
                Verify your number
              </Text>
              <Text
                style={[
                  styles.description,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Enter the 6-digit code we sent to
              </Text>
              <View style={styles.phoneRow}>
                <Text
                  style={[
                    styles.phoneNumber,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  {phoneNumber}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => navigation.goBack()}
                  style={styles.editButton}
                >
                  <Text
                    style={[
                      styles.editText,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Edit
                  </Text>
                </Pressable>
              </View>

              <Pressable
                accessibilityLabel="Enter six digit verification code"
                onPress={() => inputRef.current?.focus()}
                style={[styles.otpEntry, { marginTop: 18 * scale }]}
              >
                <View style={styles.otpSlots}>
                  {Array.from({ length: OTP_LENGTH }, (_, index) => {
                    const isActive = index === Math.min(otp.length, OTP_LENGTH - 1);
                    const digit = otp[index] ?? "";
                    return (
                      <View
                        key={index}
                        style={[
                          styles.otpSlot,
                          {
                            backgroundColor: theme.colors.surface,
                            borderColor: isActive
                              ? theme.colors.primary
                              : theme.colors.border,
                            borderRadius: theme.radius.sm,
                            height: 54 * scale,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.otpDigit,
                            { color: theme.colors.textPrimary },
                          ]}
                        >
                          {digit}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                <TextInput
                  ref={inputRef}
                  accessibilityLabel="6-digit verification code"
                  autoComplete="one-time-code"
                  autoCorrect={false}
                  keyboardType="number-pad"
                  maxLength={OTP_LENGTH}
                  onChangeText={(value) => {
                    setOtp(value.replace(/\D/g, "").slice(0, OTP_LENGTH));
                    if (error) setError("");
                  }}
                  selectionColor={theme.colors.primary}
                  style={styles.hiddenOtpInput}
                  value={otp}
                />
              </Pressable>

              {error ? (
                <Text
                  style={[
                    styles.error,
                    { color: theme.colors.error },
                  ]}
                >
                  {error}
                </Text>
              ) : null}

              <View
                style={[
                  styles.resendRow,
                  {
                    backgroundColor: `${theme.colors.primary}0A`,
                    marginBottom: 12 * scale,
                    marginTop: 12 * scale,
                    minHeight: 40 * scale,
                  },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.resendLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Didn&apos;t receive a code?
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isCountingDown }}
                  disabled={isCountingDown}
                  hitSlop={6}
                  onPress={handleResend}
                >
                  <Text
                    style={[
                      styles.resendAction,
                      {
                        color: isCountingDown
                          ? theme.colors.textSecondary
                          : theme.colors.primary,
                      },
                    ]}
                  >
                    {isCountingDown
                      ? `Resend in ${minutes}:${seconds}`
                      : "Resend code"}
                  </Text>
                </Pressable>
              </View>

              <GradientActionButton
                title="Verify & continue"
                onPress={handleVerify}
                theme={theme}
                disabled={otp.length !== OTP_LENGTH}
                fontSize={typography.label * scale}
                minHeight={54 * scale}
              />
            </View>

            <View
              style={[
                styles.illustration,
                {
                  minHeight: illustrationSize,
                  marginTop: 8 * scale,
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

export { OtpScreen as OtpVerificationScreen };

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: "5%",
  },
  flex: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    height: 46,
    justifyContent: "space-between",
  },
  backButton: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    marginLeft: -8,
    width: 42,
  },
  secureBadge: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  secureText: {
    fontSize: typography.caption,
    fontWeight: "600",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  content: {
    paddingBottom: 8,
  },
  iconBadge: {
    alignItems: "center",
    borderRadius: 17,
    borderWidth: 1,
    height: 54,
    justifyContent: "center",
    marginBottom: 18,
    width: 54,
  },
  title: {
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  description: {
    fontSize: typography.bodySmall,
    lineHeight: 21,
    marginTop: 9,
  },
  phoneRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 4,
  },
  phoneNumber: {
    fontSize: typography.body,
    fontWeight: "700",
  },
  editButton: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  editText: {
    fontSize: typography.caption,
    fontWeight: "700",
  },
  otpEntry: {
    marginTop: 24,
    position: "relative",
  },
  otpSlots: {
    flexDirection: "row",
    gap: 8,
  },
  otpSlot: {
    alignItems: "center",
    borderWidth: 1.5,
    flex: 1,
    height: 56,
    justifyContent: "center",
  },
  otpDigit: {
    fontSize: typography.h2,
    fontWeight: "700",
  },
  hiddenOtpInput: {
    ...StyleSheet.absoluteFill,
    color: "transparent",
    opacity: 0.02,
    zIndex: 1,
  },
  error: {
    fontSize: typography.caption,
    marginTop: 8,
  },
  resendRow: {
    alignItems: "center",
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
    marginTop: 18,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  resendLabel: {
    flex: 1,
    fontSize: typography.caption,
  },
  resendAction: {
    fontSize: typography.caption,
    fontWeight: "700",
  },
  illustration: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
});
