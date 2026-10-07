import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InputField } from "../../components/ui";
import { GradientActionButton } from "../../components/common/GradientActionButton";
import { AuthScreenBackground } from "../../components/layout/AuthScreenBackground";
import { typography } from "../../constants/typography";
import type { BusinessType, CurrencyCode } from "../../types";
import { useBusiness } from "../../hooks/useBusiness";
import { businessTypes, currencies } from "../shared";
import type { BusinessSetupScreenProps } from "../shared";

export function BusinessSetupScreen({
  navigation,
  theme,
}: BusinessSetupScreenProps) {
  const { updateBusiness } = useBusiness();
  const { height, width } = useWindowDimensions();
  const [businessName, setBusinessName] = useState("Verma Electronics");
  const [businessType, setBusinessType] = useState<BusinessType>("Retail");
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [address, setAddress] = useState("Sector 18, Noida, UP");
  const [error, setError] = useState("");
  const scale = Math.min(
    Math.max(Math.min(width / 390, height / 720), 0.84),
    1.12,
  );

  const handleSave = () => {
    const name = businessName.trim();
    if (!name) {
      setError("Enter your business name to continue.");
      return;
    }
    updateBusiness({
      name,
      type: businessType,
      currency,
      address: address.trim(),
    });
    navigation.replace("AppTabs");
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
              styles.stepBadge,
              { backgroundColor: `${theme.colors.primary}12` },
            ]}
          >
            <View
              style={[
                styles.stepDot,
                { backgroundColor: theme.colors.primary },
              ]}
            />
            <Text style={[styles.stepText, { color: theme.colors.primary }]}>
              BUSINESS PROFILE
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.intro,
              { marginBottom: 16 * scale, marginTop: 8 * scale },
            ]}
          >
            <View
              style={[
                styles.introIcon,
                {
                  backgroundColor: `${theme.colors.primary}12`,
                  borderColor: `${theme.colors.primary}20`,
                },
              ]}
            >
              <Ionicons
                name="storefront"
                size={25}
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
              Set up your business
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.textSecondary,
                  fontSize: typography.bodySmall * scale,
                },
              ]}
            >
              A few details help DuesMate tailor your collections workspace.
            </Text>
          </View>

          <View
            style={[
              styles.formCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: `${theme.colors.primary}28`,
                borderRadius: theme.radius.lg,
                boxShadow: `0px 8px 24px ${theme.colors.shadow}`,
                padding: 18 * scale,
              },
            ]}
          >
            <InputField
              label="Business name"
              placeholder="Enter business name"
              value={businessName}
              onChangeText={(value) => {
                setBusinessName(value);
                if (error) setError("");
              }}
              theme={theme}
            />

            <Text
              style={[
                styles.fieldLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Business type
            </Text>
            <View style={styles.chipRow}>
              {businessTypes.map((type) => {
                const selected = businessType === type;
                return (
                  <Pressable
                    key={type}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setBusinessType(type)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected
                          ? theme.colors.primary
                          : theme.colors.surface,
                        borderColor: selected
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: selected
                            ? theme.colors.onPrimary
                            : theme.colors.textPrimary,
                        },
                      ]}
                    >
                      {type}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text
              style={[
                styles.fieldLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Preferred currency
            </Text>
            <View style={styles.currencyRow}>
              {currencies.map((code) => {
                const selected = currency === code;
                return (
                  <Pressable
                    key={code}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setCurrency(code)}
                    style={[
                      styles.currencyOption,
                      {
                        backgroundColor: selected
                          ? `${theme.colors.primary}10`
                          : theme.colors.surface,
                        borderColor: selected
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencyCode,
                        {
                          color: selected
                            ? theme.colors.primary
                            : theme.colors.textPrimary,
                        },
                      ]}
                    >
                      {code}
                    </Text>
                    {selected ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={15}
                        color={theme.colors.primary}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            <InputField
              label="Business address (optional)"
              placeholder="Add your business address"
              value={address}
              onChangeText={setAddress}
              theme={theme}
              multiline
            />

            {error ? (
              <Text
                accessibilityLiveRegion="polite"
                style={[styles.error, { color: theme.colors.error }]}
              >
                {error}
              </Text>
            ) : null}

            <GradientActionButton
              title="Continue to DuesMate"
              onPress={handleSave}
              theme={theme}
              fontSize={typography.label * scale}
              minHeight={54 * scale}
            />
          </View>

          <View style={styles.footer}>
            <Ionicons
              name="lock-closed"
              size={13}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.footerText,
                { color: theme.colors.textSecondary },
              ]}
            >
              Your business information stays private and secure.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AuthScreenBackground>
  );
}

export { BusinessSetupScreen as BusinessProfileSetupScreen };

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: "5%",
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
  stepBadge: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  stepDot: {
    borderRadius: 999,
    height: 6,
    width: 6,
  },
  stepText: {
    fontSize: typography.caption - 1,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  headerSpacer: {
    width: 34,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 18,
  },
  intro: {
    marginBottom: 20,
  },
  introIcon: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    height: 54,
    justifyContent: "center",
    marginBottom: 16,
    width: 54,
  },
  title: {
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  subtitle: {
    lineHeight: 21,
    marginTop: 8,
    maxWidth: 340,
  },
  formCard: {
    borderWidth: 1,
    padding: 18,
  },
  fieldLabel: {
    fontSize: typography.label,
    fontWeight: "600",
    marginBottom: 9,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  chipText: {
    fontSize: typography.caption,
    fontWeight: "600",
  },
  currencyRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  currencyOption: {
    alignItems: "center",
    borderRadius: 11,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 4,
    height: 42,
    justifyContent: "center",
  },
  currencyCode: {
    fontSize: typography.caption,
    fontWeight: "700",
  },
  error: {
    fontSize: typography.caption,
    marginBottom: 12,
    marginTop: -6,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    marginTop: 15,
  },
  footerText: {
    fontSize: typography.caption,
  },
});
