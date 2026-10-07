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
import { GradientActionButton } from "../../components/common/GradientActionButton";
import { AuthScreenBackground } from "../../components/layout/AuthScreenBackground";
import { typography } from "../../constants/typography";
import { OnboardingIllustration } from "./OnboardingIllustration";
import type { WelcomeScreenProps } from "../shared";

export function WelcomeScreen({ navigation, theme }: WelcomeScreenProps) {
  const { height, width } = useWindowDimensions();
  const scale = Math.min(Math.max(Math.min(width / 390, height / 720), 0.9), 1);
  const illustrationSize = Math.min(width * 0.74, height * 0.36, 300);
  const openLogin = () => navigation.navigate("Login");

  return (
    <AuthScreenBackground theme={theme}>
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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

          <View style={[styles.headingSection, { marginTop: 14 * scale }]}>
            <Text
              style={[
                styles.heading,
                {
                  color: theme.colors.textPrimary,
                  fontSize: typography.h1 * scale,
                  lineHeight: typography.h1 * scale * 1.12,
                },
              ]}
            >
              Welcome to
            </Text>
            <Text
              style={[
                styles.brand,
                {
                  color: theme.colors.primary,
                  fontSize: (typography.h1 + 2) * scale,
                  lineHeight: (typography.h1 + 2) * scale * 1.12,
                },
              ]}
            >
              DuesMate
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.textSecondary,
                  fontSize: typography.bodySmall * scale,
                  lineHeight: 19 * scale,
                  marginTop: 10 * scale,
                },
              ]}
            >
              Your trusted partner in managing business dues and receivables.
            </Text>
          </View>

          <View
            style={[
              styles.illustrationArea,
              { height: illustrationSize },
            ]}
          >
            <OnboardingIllustration theme={theme} size={illustrationSize} />
          </View>

          <View style={styles.actions}>
            <GradientActionButton
              title="Get Started"
              onPress={openLogin}
              theme={theme}
              fontSize={typography.label * scale}
              minHeight={52 * scale}
            />
            <Pressable
              accessibilityRole="button"
              onPress={openLogin}
              style={styles.secondaryButton}
            >
              <Text
                style={[styles.secondaryText, { color: theme.colors.primary }]}
              >
                I Already have an account
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AuthScreenBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "transparent",
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
    width: 40,
  },
  headingSection: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  heading: {
    fontWeight: "700",
    textAlign: "center",
  },
  brand: {
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 280,
    textAlign: "center",
  },
  illustrationArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    paddingBottom: 12,
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    minHeight: 36,
  },
  secondaryText: {
    fontSize: typography.caption,
    fontWeight: "600",
  },
});
