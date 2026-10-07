import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthScreenBackground } from "../../components/layout/AuthScreenBackground";
import { typography } from "../../constants/typography";
import type { SplashScreenProps } from "../shared";

export function SplashScreen({ navigation, theme }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Welcome");
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <AuthScreenBackground theme={theme}>
      <SafeAreaView style={styles.screen}>
        <View
          style={[
            styles.logoHalo,
            { backgroundColor: `${theme.colors.primary}12` },
          ]}
        >
          <View
            style={[
              styles.logo,
              {
                backgroundColor: theme.colors.primary,
                boxShadow: `0px 8px 22px ${theme.colors.shadow}`,
              },
            ]}
          >
            <Ionicons name="wallet" size={48} color={theme.colors.onPrimary} />
          </View>
          <View
            style={[
              styles.checkBadge,
              {
                backgroundColor: theme.colors.success,
                borderColor: theme.colors.surface,
              },
            ]}
          >
            <Ionicons
              name="checkmark"
              size={17}
              color={theme.colors.onPrimary}
            />
          </View>
        </View>
        <Text style={[styles.brand, { color: theme.colors.textPrimary }]}>
          DuesMate
        </Text>
        <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
          Collect faster. Grow bigger.
        </Text>
        <View
          style={[
            styles.trustPill,
            {
              backgroundColor: `${theme.colors.primary}10`,
              borderColor: `${theme.colors.primary}20`,
            },
          ]}
        >
          <Ionicons
            name="shield-checkmark"
            size={14}
            color={theme.colors.primary}
          />
          <Text style={[styles.trustText, { color: theme.colors.primary }]}>
            Simple, secure collections
          </Text>
        </View>
      </SafeAreaView>
    </AuthScreenBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoHalo: {
    alignItems: "center",
    borderRadius: 999,
    height: 166,
    justifyContent: "center",
    width: 166,
  },
  logo: {
    alignItems: "center",
    borderRadius: 38,
    height: 116,
    justifyContent: "center",
    width: 116,
  },
  checkBadge: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 4,
    bottom: 20,
    height: 34,
    justifyContent: "center",
    position: "absolute",
    right: 15,
    width: 34,
  },
  brand: {
    fontSize: typography.h1 + 4,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 22,
  },
  tagline: {
    fontSize: typography.bodySmall,
    marginTop: 5,
  },
  trustPill: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    marginTop: 34,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  trustText: {
    fontSize: typography.caption,
    fontWeight: "600",
  },
});
