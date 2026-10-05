import { Alert, Text, View, Pressable } from "react-native";
import { Card, SectionHeader } from "../../components/ui";
import { subscription } from "../../mock/data";
import { useAuth } from "../../hooks/useAuth";
import { styles } from "../shared";
import type { MoreScreenProps } from "../shared";

export function MoreScreen({
  navigation,
  theme,
  toggleTheme,
}: MoreScreenProps) {
  const { signOut } = useAuth();
  const settings = [
    { label: "Business Profile", onPress: () => navigation.navigate("BusinessProfile") },
    { label: "WhatsApp Settings", onPress: () => navigation.navigate("WhatsAppSettings") },
    { label: "Payment Settings", onPress: () => navigation.navigate("PaymentSettings") },
    { label: "Notifications", onPress: () => navigation.navigate("NotificationSettings") },
    { label: "Reminder Automation", onPress: () => navigation.navigate("ReminderAutomation") },
    { label: "Reminder Templates", onPress: () => navigation.navigate("ReminderTemplate") },
    { label: "Subscription", onPress: () => Alert.alert("Subscription", `${subscription.plan} plan is ${subscription.status}.`) },
    { label: "Profile", onPress: () => navigation.navigate("Profile") },
    { label: "Dark Mode", onPress: () => toggleTheme?.() },
    {
      label: "Logout",
      onPress: () => {
        signOut();
        navigation.getParent()?.reset({
          index: 0,
          routes: [{ name: "Welcome" }],
        });
      },
    },
  ] as const;

  return (
    <View
      style={[
        styles.listContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <SectionHeader title="More" theme={theme} />
      {settings.map((item) => (
        <Pressable
          key={item.label}
          onPress={item.onPress}
        >
          <Card theme={theme}>
            <Text
              style={[styles.listTitle, { color: theme.colors.textPrimary }]}
            >
              {item.label}
            </Text>
          </Card>
        </Pressable>
      ))}
    </View>
  );
}
