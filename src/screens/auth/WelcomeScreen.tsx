import { Text, View, Pressable } from "react-native";
import { AppButton } from "../../components/ui";
import { styles } from "../shared";
import type { WelcomeScreenProps } from "../shared";

export function WelcomeScreen({ navigation, theme }: WelcomeScreenProps) {
  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background, paddingHorizontal: 20 },
      ]}
    >
      <View style={styles.welcomeBrand}>
        <View
          style={[
            styles.welcomeMark,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Text style={styles.welcomeMarkText}>D</Text>
        </View>
        <View>
          <Text style={[styles.brand, { color: theme.colors.textPrimary }]}>
            DuesMate
          </Text>
          <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
            Collect Faster. Grow Bigger.
          </Text>
        </View>
      </View>
      <Text style={[styles.heroTitle, { color: theme.colors.textPrimary }]}>
        Track every due.
      </Text>
      <Text style={[styles.heroTitle, { color: theme.colors.textPrimary }]}>
        Remind with ease.
      </Text>
      <Text
        style={[styles.heroSubtitle, { color: theme.colors.textSecondary }]}
      >
        Make collection simpler for your business and your customers.
      </Text>
      <View
        style={[
          styles.featureCard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.featureText, { color: theme.colors.textPrimary }]}>
          ✓ Follow up faster
        </Text>
        <Text style={[styles.featureText, { color: theme.colors.textPrimary }]}>
          ✓ See outstanding dues clearly
        </Text>
        <Text style={[styles.featureText, { color: theme.colors.textPrimary }]}>
          ✓ Send WhatsApp payment reminders
        </Text>
      </View>
      <AppButton
        title="Get Started"
        onPress={() => navigation.navigate("Login")}
        theme={theme}
      />
      <Pressable
        style={styles.secondaryAction}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={[styles.secondaryText, { color: theme.colors.primary }]}>
          Already have an account? Log in
        </Text>
      </Pressable>
    </View>
  );
}
