import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../components/ui";
import { FinanceScreenBackground } from "../../components/layout/FinanceScreenBackground";
import { subscription } from "../../mock/data";
import { useAuth } from "../../hooks/useAuth";
import { useBusiness } from "../../hooks/useBusiness";
import { styles } from "../shared";
import type { MoreScreenProps } from "../shared";

const settings = [
  {
    label: "WhatsApp Settings",
    icon: "logo-whatsapp",
    route: "WhatsAppSettings",
  },
  { label: "Payment Settings", icon: "card-outline", route: "PaymentSettings" },
  {
    label: "Notifications",
    icon: "notifications-outline",
    route: "NotificationSettings",
  },
  {
    label: "Reminder Automation",
    icon: "time-outline",
    route: "ReminderAutomation",
  },
  {
    label: "Reminder Templates",
    icon: "chatbox-ellipses-outline",
    route: "ReminderTemplate",
  },
] as const satisfies readonly {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route:
    | "WhatsAppSettings"
    | "PaymentSettings"
    | "NotificationSettings"
    | "ReminderAutomation"
    | "ReminderTemplate";
}[];

export function MoreScreen({
  navigation,
  theme,
  toggleTheme,
}: MoreScreenProps) {
  const { user: signedInUser, signOut } = useAuth();
  const { business } = useBusiness();
  const [logoutConfirmationVisible, setLogoutConfirmationVisible] =
    useState(false);

  const userName = business.ownerName?.trim() || signedInUser?.name || "Account";
  const userPhone = signedInUser?.phone || business.phone;

  const confirmLogout = () => {
    setLogoutConfirmationVisible(false);
    signOut();
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  return (
    <FinanceScreenBackground theme={theme}>
      <ScrollView
        contentContainerStyle={profileStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[styles.screenTitle, { color: theme.colors.textPrimary }]}
        >
          Profile
        </Text>
        <Card theme={theme} style={profileStyles.profileCard}>
          <Pressable
            accessibilityLabel="Edit profile and business details"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => navigation.navigate("BusinessProfile")}
            style={({ pressed }) => [
              profileStyles.editButton,
              {
                backgroundColor: theme.colors.surfaceAlt,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={theme.colors.primary}
            />
          </Pressable>
          <View
            style={[
              profileStyles.avatar,
              { backgroundColor: theme.colors.accent },
            ]}
          >
            <Text
              style={[
                profileStyles.avatarText,
                { color: theme.colors.primaryDark },
              ]}
            >
              {userName.slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            style={[
              profileStyles.userName,
              { color: theme.colors.textPrimary },
            ]}
          >
            {userName}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              profileStyles.businessName,
              { color: theme.colors.textSecondary },
            ]}
          >
            {business.name}
          </Text>
          <View
            style={[
              profileStyles.contactRow,
              { borderTopColor: theme.colors.border },
            ]}
          >
            <Ionicons
              name="call-outline"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[
                profileStyles.contactText,
                { color: theme.colors.textSecondary },
              ]}
            >
              {userPhone}
            </Text>
          </View>
        </Card>

        <Text
          style={[profileStyles.sectionTitle, { color: theme.colors.textPrimary }]}
        >
          Account & Preferences
        </Text>
        <View style={profileStyles.options}>
          {settings.map((item) => (
            <Pressable
              accessibilityRole="button"
              key={item.label}
              onPress={() => navigation.navigate(item.route)}
              style={({ pressed }) => [
                profileStyles.option,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={21}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  profileStyles.optionLabel,
                  { color: theme.colors.textPrimary },
                ]}
              >
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.textSecondary}
              />
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              Alert.alert(
                "Subscription",
                `${subscription.plan} plan is ${subscription.status}.`,
              )
            }
            style={({ pressed }) => [
              profileStyles.option,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Ionicons
              name="receipt-outline"
              size={21}
              color={theme.colors.primary}
            />
            <Text
              style={[
                profileStyles.optionLabel,
                { color: theme.colors.textPrimary },
              ]}
            >
              Subscription
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textSecondary}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => toggleTheme?.()}
            style={({ pressed }) => [
              profileStyles.option,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Ionicons
              name="contrast-outline"
              size={21}
              color={theme.colors.primary}
            />
            <Text
              style={[
                profileStyles.optionLabel,
                { color: theme.colors.textPrimary },
              ]}
            >
              Dark Mode
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textSecondary}
            />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => setLogoutConfirmationVisible(true)}
          style={({ pressed }) => [
            profileStyles.logoutButton,
            {
              backgroundColor: theme.colors.error,
              opacity: pressed ? 0.82 : 1,
            },
          ]}
        >
          <Ionicons name="log-out-outline" size={20} color="#ffffff" />
          <Text style={profileStyles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={() => setLogoutConfirmationVisible(false)}
        transparent
        visible={logoutConfirmationVisible}
      >
        <View style={profileStyles.modalBackdrop}>
          <View
            style={[
              profileStyles.confirmation,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              style={[
                profileStyles.confirmationTitle,
                { color: theme.colors.textPrimary },
              ]}
            >
              Log out?
            </Text>
            <Text
              style={[
                profileStyles.confirmationMessage,
                { color: theme.colors.textSecondary },
              ]}
            >
              You will need to sign in again to access your account.
            </Text>
            <View style={profileStyles.confirmationActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setLogoutConfirmationVisible(false)}
                style={[
                  profileStyles.confirmationButton,
                  { backgroundColor: theme.colors.surfaceAlt },
                ]}
              >
                <Text
                  style={[
                    profileStyles.confirmationButtonText,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={confirmLogout}
                style={[
                  profileStyles.confirmationButton,
                  { backgroundColor: theme.colors.error },
                ]}
              >
                <Text
                  style={[
                    profileStyles.confirmationButtonText,
                    { color: "#ffffff" },
                  ]}
                >
                  Log Out
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </FinanceScreenBackground>
  );
}

const profileStyles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  profileCard: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  editButton: {
    alignItems: "center",
    borderRadius: 10,
    height: 38,
    justifyContent: "center",
    position: "absolute",
    right: 14,
    top: 14,
    width: 38,
    zIndex: 1,
  },
  avatar: {
    alignItems: "center",
    borderRadius: 36,
    height: 72,
    justifyContent: "center",
    marginBottom: 14,
    width: 72,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "800",
  },
  userName: {
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
  },
  businessName: {
    fontSize: 15,
    marginTop: 5,
    textAlign: "center",
  },
  contactRow: {
    alignItems: "center",
    alignSelf: "stretch",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 18,
    minHeight: 48,
  },
  contactText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },
  options: {
    gap: 10,
  },
  option: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    minHeight: 58,
    paddingHorizontal: 16,
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  logoutButton: {
    alignItems: "center",
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginTop: 28,
    minHeight: 54,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "#00000066",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  confirmation: {
    borderRadius: 18,
    maxWidth: 420,
    padding: 22,
    width: "100%",
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  confirmationMessage: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  confirmationActions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 22,
  },
  confirmationButton: {
    alignItems: "center",
    borderRadius: 10,
    minWidth: 96,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  confirmationButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
