import { useEffect } from "react";
import { Text, View } from "react-native";
import { styles } from "../shared";
import type { SplashScreenProps } from "../shared";

export function SplashScreen({ navigation, theme }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Welcome");
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View
      style={[
        styles.screen,
        {
          alignItems: "center",
          backgroundColor: theme.colors.background,
          justifyContent: "center",
        },
      ]}
    >
      <View
        style={[
          styles.logoCircle,
          {
            backgroundColor: theme.colors.primary,
            boxShadow: `0px 8px 18px ${theme.colors.shadow}`,
          },
        ]}
      >
        <Text style={styles.logoText}>D</Text>
      </View>
      <Text
        style={[
          styles.brand,
          styles.welcomeBrandTitle,
          { color: theme.colors.textPrimary },
        ]}
      >
        DuesMate
      </Text>
      <Text
        style={[
          styles.tagline,
          styles.welcomeBrandTagline,
          { color: theme.colors.textSecondary },
        ]}
      >
        Collect Faster. Grow Bigger.
      </Text>
    </View>
  );
}
