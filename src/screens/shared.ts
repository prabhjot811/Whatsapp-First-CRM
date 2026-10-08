import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useFocusEffect, type CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BusinessType, CurrencyCode, NotificationSettings, PaymentMethod } from "../types";
import { type AppTabParamList, type RootStackParamList } from "../navigation/types";
import type { AppTheme } from "../theme/theme";

export type ThemeProps = { theme: AppTheme; toggleTheme?: () => void };

export type SplashScreenProps = NativeStackScreenProps<RootStackParamList, "Splash"> &
  ThemeProps;

export type WelcomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Welcome"
> &
  ThemeProps;

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login"> &
  ThemeProps;

export type OtpScreenProps = NativeStackScreenProps<RootStackParamList, "Otp"> &
  ThemeProps;

export type BusinessSetupScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "BusinessSetup"
> &
  ThemeProps;

export type CustomerDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CustomerDetail"
> &
  ThemeProps;

export type AddCustomerScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "AddCustomer"
> &
  ThemeProps;

export type AddDueScreenProps = NativeStackScreenProps<RootStackParamList, "AddDue"> &
  ThemeProps;

export type RecordPaymentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "RecordPayment"
> &
  ThemeProps;

export type ReminderScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SendReminder"
> &
  ThemeProps;

export type PaymentLinkScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PaymentLink"
> &
  ThemeProps;

export type BusinessProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "BusinessProfile"
> &
  ThemeProps;

export type CustomersScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, "Customers">,
  NativeStackScreenProps<RootStackParamList>
> &
  ThemeProps;

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
> &
  ThemeProps;

export type TransactionsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, "Transactions">,
  NativeStackScreenProps<RootStackParamList>
> &
  ThemeProps;

export type MoreScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, "Profile">,
  NativeStackScreenProps<RootStackParamList>
> &
  ThemeProps;

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

export const amountColor = (amount: number, theme: AppTheme) =>
  amount > 0 ? theme.colors.primary : theme.colors.textPrimary;

export const paymentMethods: PaymentMethod[] = [
  "UPI",
  "cash",
  "bank-transfer",
  "card",
  "other",
];

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  UPI: "UPI",
  cash: "Cash",
  "bank-transfer": "Bank transfer",
  card: "Card",
  other: "Other",
};

export const businessTypes: BusinessType[] = [
  "Retail",
  "Wholesale",
  "Services",
  "Manufacturing",
  "Other",
];

export const currencies: CurrencyCode[] = ["INR", "USD", "AED", "EUR"];

export const customerFilters = [
  "All",
  "With Dues",
  "Due Today",
  "Overdue",
  "Paid",
] as const;

export type CustomerFilter = (typeof customerFilters)[number];

export const transactionFilters = ["All", "Credits", "Payments"] as const;

export type TransactionFilter = (typeof transactionFilters)[number];

export const reminderFilters = ["All", "Sent", "Delivered", "Read", "Failed"] as const;

export type ReminderFilter = (typeof reminderFilters)[number];

export const notificationOptions: {
  key: keyof NotificationSettings;
  label: string;
}[] = [
  { key: "paymentReceived", label: "Payment received" },
  { key: "reminderNotifications", label: "Reminder updates" },
  { key: "failedReminderNotifications", label: "Failed reminders" },
  { key: "dailyCollectionSummary", label: "Daily collection summary" },
  { key: "weeklySummary", label: "Weekly summary" },
];

export function useRefreshOnFocus(): void {
  const [, setRevision] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setRevision((revision) => revision + 1);
    }, []),
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 32,
    justifyContent: "flex-start",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  contentContainer: {
    paddingBottom: 28,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  logoText: {
    fontSize: 56,
    fontWeight: "800",
    color: "#fff",
  },
  brand: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  tagline: {
    marginTop: 2,
    fontSize: 12,
    textAlign: "left",
  },
  welcomeBrand: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  welcomeMark: {
    alignItems: "center",
    borderRadius: 16,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  welcomeMarkText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  welcomeBrandTitle: {
    fontSize: 23,
    marginTop: 0,
  },
  welcomeBrandTagline: {
    fontSize: 12,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  featureCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 24,
  },
  featureText: {
    fontSize: 16,
    marginBottom: 8,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
  },
  screenLabel: {
    fontSize: 14,
    marginBottom: 10,
  },
  inlineFields: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  countryInput: {
    width: 74,
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  otpInput: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    textAlign: "center",
    letterSpacing: 12,
    marginBottom: 18,
    fontSize: 18,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secondaryAction: {
    marginTop: 20,
    alignItems: "center",
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 13,
    marginBottom: 12,
  },
  topBar: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
  },
  cardLabel: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 6,
  },
  principalAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#5a6a6d",
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  listMeta: {
    fontSize: 13,
    marginTop: 6,
  },
  moneyText: {
    fontSize: 18,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
    marginBottom: 10,
  },
  toolbar: {
    gap: 12,
    marginBottom: 12,
  },
  searchInput: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: "#ebfaf6",
    paddingHorizontal: 12,
  },
  addButtonText: {
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "700",
  },
  messageInput: {
    minHeight: 140,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    textAlignVertical: "top",
    marginBottom: 18,
  },
  toggle: {
    width: 56,
    height: 32,
    borderRadius: 999,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
