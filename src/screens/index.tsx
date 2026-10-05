import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useFocusEffect, type CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  AppButton,
  Card,
  EmptyState,
  ErrorState,
  InputField,
  SectionHeader,
  StatusBadge,
} from "../components/ui";
import { PhoneInput } from "../components/common/PhoneInput";
import { AmountInput } from "../components/common/AmountInput";
import { ScreenWrapper } from "../components/layout/ScreenWrapper";
import { Header } from "../components/layout/Header";
import { CustomerCard } from "../components/composite/CustomerCard";
import { TransactionCard } from "../components/composite/TransactionCard";
import { PaymentCard } from "../components/composite/PaymentCard";
import { ReminderCard } from "../components/composite/ReminderCard";
import {
  notificationSettings,
  reminderRules,
  reminderTemplates,
  subscription,
  user,
} from "../mock/data";
import { mockService } from "../services/mockServices";
import { appConfig } from "../constants/config";
import { formatDate, toIsoDate } from "../utils/dateFormatter";
import { getAmountError, isValidEmail, isValidPhone } from "../utils/validators";
import { parseAmount } from "../utils/currencyFormatter";
import { getErrorMessage } from "../utils/errorHandler";
import type {
  BusinessType,
  CurrencyCode,
  NotificationSettings,
  PaymentMethod,
  ReminderRule,
} from "../types";
import { useAuth } from "../hooks/useAuth";
import { useBusiness } from "../hooks/useBusiness";
import { useCurrencyFormatter } from "../hooks/useCurrencyFormatter";
import { useDebounce } from "../hooks/useDebounce";
import {
  type AppTabParamList,
  type RootStackParamList,
} from "../navigation/types";
import type { AppTheme } from "../theme/theme";

type ThemeProps = { theme: AppTheme; toggleTheme?: () => void };

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, "Splash"> &
  ThemeProps;
type WelcomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Welcome"
> &
  ThemeProps;
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login"> &
  ThemeProps;
type OtpScreenProps = NativeStackScreenProps<RootStackParamList, "Otp"> &
  ThemeProps;
type BusinessSetupScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "BusinessSetup"
> &
  ThemeProps;
type CustomerDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CustomerDetail"
> &
  ThemeProps;
type AddCustomerScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "AddCustomer"
> &
  ThemeProps;
type AddDueScreenProps = NativeStackScreenProps<RootStackParamList, "AddDue"> &
  ThemeProps;
type RecordPaymentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "RecordPayment"
> &
  ThemeProps;
type ReminderScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SendReminder"
> &
  ThemeProps;
type PaymentLinkScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PaymentLink"
> &
  ThemeProps;
type BusinessProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "BusinessProfile"
> &
  ThemeProps;

type CustomersScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, "Customers">,
  NativeStackScreenProps<RootStackParamList>
> &
  ThemeProps;

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
> &
  ThemeProps;

type TransactionsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, "Transactions">,
  NativeStackScreenProps<RootStackParamList>
> &
  ThemeProps;

type MoreScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, "More">,
  NativeStackScreenProps<RootStackParamList>
> &
  ThemeProps;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const amountColor = (amount: number, theme: AppTheme) =>
  amount > 0 ? theme.colors.primary : theme.colors.textPrimary;

const paymentMethods: PaymentMethod[] = [
  "UPI",
  "cash",
  "bank-transfer",
  "card",
  "other",
];

const paymentMethodLabel: Record<PaymentMethod, string> = {
  UPI: "UPI",
  cash: "Cash",
  "bank-transfer": "Bank transfer",
  card: "Card",
  other: "Other",
};
const businessTypes: BusinessType[] = [
  "Retail",
  "Wholesale",
  "Services",
  "Manufacturing",
  "Other",
];
const currencies: CurrencyCode[] = ["INR", "USD", "AED", "EUR"];
const customerFilters = [
  "All",
  "With Dues",
  "Due Today",
  "Overdue",
  "Paid",
] as const;
type CustomerFilter = (typeof customerFilters)[number];
const transactionFilters = ["All", "Credits", "Payments"] as const;
type TransactionFilter = (typeof transactionFilters)[number];
const reminderFilters = ["All", "Sent", "Delivered", "Read", "Failed"] as const;
type ReminderFilter = (typeof reminderFilters)[number];
const notificationOptions: {
  key: keyof NotificationSettings;
  label: string;
}[] = [
  { key: "paymentReceived", label: "Payment received" },
  { key: "reminderNotifications", label: "Reminder updates" },
  { key: "failedReminderNotifications", label: "Failed reminders" },
  { key: "dailyCollectionSummary", label: "Daily collection summary" },
  { key: "weeklySummary", label: "Weekly summary" },
];

function useRefreshOnFocus(): void {
  const [, setRevision] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setRevision((revision) => revision + 1);
    }, []),
  );
}

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

export function LoginScreen({ navigation, theme }: LoginScreenProps) {
  const { requestOtp } = useAuth();
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("98765 43210");
  const [error, setError] = useState("");

  const handleContinue = () => {
    const cleaned = phoneNumber.replace(/\s+/g, "");
    if (!cleaned || cleaned.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }
    const phone = `${countryCode} ${cleaned}`.trim();
    try {
      requestOtp(phone);
      setError("");
      navigation.navigate("Otp", { phoneNumber: phone });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
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
        Login
      </Text>
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Phone number
      </Text>
      <View style={styles.inlineFields}>
        <TextInput
          value={countryCode}
          onChangeText={setCountryCode}
          style={[
            styles.countryInput,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.textPrimary,
            },
          ]}
        />
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholder="Phone number"
          style={[
            styles.phoneInput,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.textPrimary,
            },
          ]}
        />
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
      <AppButton title="Continue" onPress={handleContinue} theme={theme} />
    </View>
  );
}

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

export function BusinessSetupScreen({
  navigation,
  theme,
}: BusinessSetupScreenProps) {
  const { updateBusiness } = useBusiness();
  const [businessName, setBusinessName] = useState("Verma Electronics");
  const [businessType, setBusinessType] = useState<BusinessType>("Retail");
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [address, setAddress] = useState("Sector 18, Noida, UP");

  const handleSave = () => {
    if (!businessName.trim()) {
      return;
    }
    updateBusiness({
      name: businessName.trim(),
      type: businessType,
      currency,
      address: address.trim(),
    });
    navigation.replace("AppTabs");
  };

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background, paddingHorizontal: 20 },
      ]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        Business setup
      </Text>
      <InputField
        label="Business name"
        placeholder="Enter business name"
        value={businessName}
        onChangeText={setBusinessName}
        theme={theme}
      />
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Business type
      </Text>
      <View style={styles.filterRow}>
        {businessTypes.map((type) => (
          <Pressable
            key={type}
            onPress={() => setBusinessType(type)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  businessType === type
                    ? theme.colors.primary
                    : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    businessType === type
                      ? "#fff"
                      : theme.colors.textPrimary,
                },
              ]}
            >
              {type}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Currency
      </Text>
      <View style={styles.filterRow}>
        {currencies.map((code) => (
          <Pressable
            key={code}
            onPress={() => setCurrency(code)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  currency === code ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: currency === code ? "#fff" : theme.colors.textPrimary,
                },
              ]}
            >
              {code}
            </Text>
          </Pressable>
        ))}
      </View>
      <InputField
        label="Optional business address"
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        theme={theme}
        multiline
      />
      <AppButton title="Continue" onPress={handleSave} theme={theme} />
    </View>
  );
}

export function HomeScreen({ navigation, theme }: HomeScreenProps) {
  useRefreshOnFocus();
  const formatMoney = useCurrencyFormatter();
  const summary = mockService.getDashboardSummary();
  const attentionCustomers = mockService
    .getCustomers()
    .filter(
      (customer) =>
        mockService.getCustomerOverdueBalance(customer.id) > 0 ||
        mockService.getCustomerDueTodayBalance(customer.id) > 0,
    )
    .slice(0, 3);

  return (
    <ScrollView
      style={[
        styles.listContainer,
        { backgroundColor: theme.colors.background },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.topBar}>
        <Text style={[styles.greeting, { color: theme.colors.textPrimary }]}>
          {getGreeting()}, Raj 👋
        </Text>
      </View>
      <Card
        theme={theme}
        style={{
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        }}
      >
        <Text style={styles.cardLabel}>Total Pending</Text>
        <Text style={styles.principalAmount}>
          {formatMoney(summary.totalPending)}
        </Text>
      </Card>

      <View style={styles.summaryGrid}>
        <Card theme={theme} style={{ flex: 1 }}>
          <Text style={styles.summaryLabel}>Due Today</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
            {formatMoney(summary.dueToday)}
          </Text>
        </Card>
        <Card theme={theme} style={{ flex: 1 }}>
          <Text style={styles.summaryLabel}>Overdue</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
            {formatMoney(summary.overdue)}
          </Text>
        </Card>
      </View>
      <Card theme={theme}>
        <Text style={styles.summaryLabel}>Collected This Month</Text>
        <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
          {formatMoney(summary.collectedThisMonth)}
        </Text>
      </Card>

      <SectionHeader title="Needs Attention" theme={theme} />
      {attentionCustomers.map((customer) => (
        <Card key={customer.id} theme={theme}>
          <View style={styles.rowBetween}>
            <View>
              <Text
                style={[styles.listTitle, { color: theme.colors.textPrimary }]}
              >
                {customer.name}
              </Text>
              <Text
                style={[styles.listMeta, { color: theme.colors.textSecondary }]}
              >
                {mockService.getCustomerOverdueBalance(customer.id) > 0
                  ? `${formatMoney(
                      mockService.getCustomerOverdueBalance(customer.id),
                    )} overdue`
                  : `${formatMoney(
                      mockService.getCustomerDueTodayBalance(customer.id),
                    )} due today`}
              </Text>
            </View>
            <AppButton
              title="Remind"
              onPress={() =>
                navigation.navigate("SendReminder", { customerId: customer.id })
              }
              theme={theme}
              variant="secondary"
            />
          </View>
        </Card>
      ))}

      <View style={styles.actionRow}>
        <AppButton
          title="Add Transaction"
          onPress={() =>
            navigation.navigate("AddDue", { customerId: "cust-1" })
          }
          theme={theme}
        />
        <AppButton
          title="Add Customer"
          onPress={() => navigation.navigate("AddCustomer")}
          theme={theme}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

export function CustomersScreen({ navigation, theme }: CustomersScreenProps) {
  useRefreshOnFocus();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CustomerFilter>("All");
  const debouncedQuery = useDebounce(query, 250);
  const customersList = mockService
    .getCustomers()
    .filter((customer) => customer.status === "active");

  const filteredCustomers = customersList.filter((customer) => {
    const matchesQuery =
      customer.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      customer.phone.includes(debouncedQuery);
    if (!matchesQuery) return false;
    if (filter === "All") return true;
    const balance = mockService.getCustomerOutstandingBalance(customer.id);
    if (filter === "With Dues") return balance > 0;
    if (filter === "Due Today")
      return mockService.getCustomerDueTodayBalance(customer.id) > 0;
    if (filter === "Overdue")
      return mockService.getCustomerOverdueBalance(customer.id) > 0;
    return balance === 0;
  });

  return (
    <View
      style={[
        styles.listContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.toolbar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search customers"
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.textPrimary,
            },
          ]}
        />
        <Pressable
          onPress={() => navigation.navigate("AddCustomer")}
          style={styles.addButton}
        >
          <Ionicons name="person-add" size={22} color={theme.colors.primary} />
          <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>
            Add Customer
          </Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {customerFilters.map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  filter === item ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === item ? "#fff" : theme.colors.textPrimary },
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CustomerCard
            customer={item}
            balance={mockService.getCustomerOutstandingBalance(item.id)}
            overdueBalance={mockService.getCustomerOverdueBalance(item.id)}
            dueTodayBalance={mockService.getCustomerDueTodayBalance(item.id)}
            theme={theme}
            onPress={() =>
              navigation.navigate("CustomerDetail", { customerId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No customers yet"
            description="Start by adding your first customer."
            actionLabel="Add Customer"
            onAction={() => navigation.navigate("AddCustomer")}
            theme={theme}
          />
        }
      />
    </View>
  );
}

export function AddCustomerScreen({
  navigation,
  theme,
}: AddCustomerScreenProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("Enter a valid phone number.");
      return;
    }
    if (email.trim() && !isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    try {
      mockService.createCustomer({
        businessId: appConfig.businessId,
        name,
        phone,
        email,
        notes,
      });
      setError("");
      navigation.goBack();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  };

  return (
    <ScreenWrapper theme={theme} scrollable>
      <Header
        title="Add Customer"
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <InputField
        label="Full Name"
        placeholder="Customer name"
        value={name}
        onChangeText={setName}
        theme={theme}
      />
      <PhoneInput
        label="Phone Number"
        placeholder="+91 98765 43210"
        value={phone}
        onChangeText={setPhone}
        theme={theme}
      />
      <InputField
        label="Email (optional)"
        placeholder="customer@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        theme={theme}
      />
      <InputField
        label="Notes (optional)"
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        theme={theme}
        multiline
      />
      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
      <AppButton title="Save Customer" onPress={handleSave} theme={theme} />
    </ScreenWrapper>
  );
}

export function CustomerDetailScreen({
  route,
  navigation,
  theme,
}: CustomerDetailScreenProps) {
  useRefreshOnFocus();
  const formatMoney = useCurrencyFormatter();
  const customer = mockService.getCustomer(route.params.customerId);
  const transactions = mockService.getCustomerTransactions(
    route.params.customerId,
  );
  const payments = mockService
    .getCustomerPayments(route.params.customerId)
    .filter((payment) => payment.status === "successful");
  const nextDueDate = transactions
    .filter(
      (transaction) =>
        transaction.type === "credit" && transaction.dueDate !== undefined,
    )
    .sort(
      (a, b) =>
        new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime(),
    )[0]?.dueDate;
  const balance = mockService.getCustomerOutstandingBalance(
    route.params.customerId,
  );

  if (!customer) {
    return (
      <ErrorState
        title="Customer not found"
        description="This customer could not be loaded."
        onRetry={() => navigation.goBack()}
        theme={theme}
      />
    );
  }

  return (
    <ScrollView
      style={[
        styles.listContainer,
        { backgroundColor: theme.colors.background },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <Header
        title={customer.name}
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
        {customer.phone}
      </Text>

      <Card theme={theme}>
        <Text
          style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
        >
          Total Due
        </Text>
        <Text
          style={[styles.summaryValue, { color: amountColor(balance, theme) }]}
        >
          {formatMoney(balance)}
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          Last payment:{" "}
          {payments[0] ? formatMoney(payments[0].amount) : "No payments"}
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          Next due: {nextDueDate ? formatDate(nextDueDate) : "No due date"}
        </Text>
      </Card>

      <View style={styles.actionRow}>
        <AppButton
          title="Send Reminder"
          onPress={() =>
            navigation.navigate("SendReminder", { customerId: customer.id })
          }
          theme={theme}
        />
        <AppButton
          title="Add Due"
          onPress={() =>
            navigation.navigate("AddDue", { customerId: customer.id })
          }
          theme={theme}
          variant="secondary"
        />
      </View>
      <View style={styles.actionRow}>
        <AppButton
          title="Record Payment"
          onPress={() =>
            navigation.navigate("RecordPayment", { customerId: customer.id })
          }
          theme={theme}
          variant="secondary"
        />
      </View>

      <SectionHeader title="Transactions" theme={theme} />
      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions"
          description="Add a due or payment to get started."
          actionLabel="Add Due"
          onAction={() =>
            navigation.navigate("AddDue", { customerId: customer.id })
          }
          theme={theme}
        />
      ) : null}
      {transactions.slice(0, 3).map((transaction) => (
        <Card key={transaction.id} theme={theme}>
          <View style={styles.rowBetween}>
            <Text
              style={[styles.listTitle, { color: theme.colors.textPrimary }]}
            >
              {transaction.type === "credit" ? "Credit" : "Payment"}
            </Text>
            <Text
              style={[
                styles.moneyText,
                {
                  color:
                    transaction.type === "credit"
                      ? theme.colors.primary
                      : theme.colors.success,
                },
              ]}
            >
              {formatMoney(transaction.amount)}
            </Text>
          </View>
          <Text
            style={[styles.listMeta, { color: theme.colors.textSecondary }]}
          >
            {transaction.description}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
}

export function TransactionsScreen({
  navigation,
  theme,
}: TransactionsScreenProps) {
  useRefreshOnFocus();
  const [filter, setFilter] = useState<TransactionFilter>("All");
  const transactionList = mockService.getTransactions();
  const filtered = transactionList.filter(
    (item) =>
      filter === "All" ||
      (filter === "Credits" ? item.type === "credit" : item.type === "payment"),
  );

  return (
    <ScrollView
      style={[
        styles.listContainer,
        { backgroundColor: theme.colors.background },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <SectionHeader title="Transaction history" theme={theme} />
      <View style={styles.filterRow}>
        {transactionFilters.map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  filter === item ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === item ? "#fff" : theme.colors.textPrimary },
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
      {filtered.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Your transaction history will appear here."
          theme={theme}
          actionLabel="Add Transaction"
          onAction={() =>
            navigation.navigate("AddDue", {
              customerId: mockService.getCustomers()[0]?.id ?? "cust-1",
            })
          }
        />
      ) : null}
      {filtered.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          customerName={
            mockService.getCustomer(transaction.customerId)?.name ??
            "Unknown customer"
          }
          theme={theme}
        />
      ))}
    </ScrollView>
  );
}

export function AddDueScreen({ route, navigation, theme }: AddDueScreenProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const value = parseAmount(amount);
    const validDueDate = toIsoDate(dueDate);
    if (!value) {
      setError(getAmountError(amount) ?? "Enter a valid amount.");
      return;
    }
    if (!validDueDate) {
      setError("Enter a valid due date in YYYY-MM-DD format.");
      return;
    }
    try {
      mockService.addTransaction({
        businessId: appConfig.businessId,
        customerId: route.params.customerId,
        type: "credit",
        amount: value,
        description: description.trim() || "Due added",
        reference: reference.trim() || `INV-${Date.now()}`,
        dueDate: validDueDate,
        notes: notes.trim() || undefined,
      });
      setError("");
      navigation.goBack();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  };

  return (
    <ScreenWrapper theme={theme} scrollable>
      <Header
        title="Add Due"
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <AmountInput
        label="Amount"
        placeholder="₹10,000"
        value={amount}
        onChangeText={setAmount}
        theme={theme}
      />
      <InputField
        label="Description"
        placeholder="Invoice or product description"
        value={description}
        onChangeText={setDescription}
        theme={theme}
      />
      <InputField
        label="Invoice / reference number"
        placeholder="INV-1024"
        value={reference}
        onChangeText={setReference}
        theme={theme}
      />
      <InputField
        label="Due date"
        placeholder="2026-10-10"
        value={dueDate}
        onChangeText={setDueDate}
        theme={theme}
      />
      <InputField
        label="Optional notes"
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        theme={theme}
        multiline
      />
      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
      <AppButton title="Save" onPress={handleSave} theme={theme} />
    </ScreenWrapper>
  );
}

export function RecordPaymentScreen({
  route,
  navigation,
  theme,
}: RecordPaymentScreenProps) {
  const formatMoney = useCurrencyFormatter();
  const customer = mockService.getCustomer(route.params.customerId);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("UPI");
  const [reference, setReference] = useState("PAY-2026");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const outstanding = mockService.getCustomerOutstandingBalance(
    route.params.customerId,
  );
  const parsedAmount = parseAmount(amount);
  const remaining = Math.max(0, outstanding - (parsedAmount ?? 0));
  const amountError = getAmountError(amount);
  const exceedsBalance = parsedAmount !== null && parsedAmount > outstanding;

  const handleSave = () => {
    if (!customer) {
      setError("Customer could not be found.");
      return;
    }
    if (amountError || parsedAmount === null) {
      setError(amountError ?? "Enter a valid amount.");
      return;
    }
    if (exceedsBalance) {
      setError(
        `Payment cannot exceed the outstanding balance of ${formatMoney(outstanding)}.`,
      );
      return;
    }
    try {
      mockService.recordPayment({
        businessId: customer.businessId,
        customerId: customer.id,
        amount: parsedAmount,
        paymentMethod: method,
        status: "successful",
        reference: reference.trim(),
        notes: notes.trim() || undefined,
      });
      setError("");
      navigation.goBack();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  };

  return (
    <ScreenWrapper theme={theme} scrollable>
      <Header
        title="Record Payment"
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
        Customer: {customer?.name}
      </Text>
      <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
        Outstanding: {formatMoney(outstanding)}
      </Text>
      <AmountInput
        label="Amount"
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        theme={theme}
      />
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Payment method
      </Text>
      <View style={styles.filterRow}>
        {paymentMethods.map((paymentMethod) => (
          <Pressable
            key={paymentMethod}
            accessibilityRole="button"
            accessibilityState={{ selected: method === paymentMethod }}
            onPress={() => setMethod(paymentMethod)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  method === paymentMethod
                    ? theme.colors.primary
                    : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    method === paymentMethod
                      ? "#fff"
                      : theme.colors.textPrimary,
                },
              ]}
            >
              {paymentMethodLabel[paymentMethod]}
            </Text>
          </Pressable>
        ))}
      </View>
      <InputField
        label="Reference number"
        placeholder="REF-100"
        value={reference}
        onChangeText={setReference}
        theme={theme}
      />
      <InputField
        label="Notes"
        placeholder="Optional notes"
        value={notes}
        onChangeText={setNotes}
        theme={theme}
        multiline
      />
      <Card theme={theme}>
        <Text
          style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
        >
          Remaining
        </Text>
        <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
          {formatMoney(remaining)}
        </Text>
      </Card>
      {error || (amount.length > 0 && (amountError || exceedsBalance)) ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error ||
            (exceedsBalance
              ? "Payment cannot exceed the outstanding balance."
              : amountError)}
        </Text>
      ) : null}
      <AppButton
        title="Save Payment"
        onPress={handleSave}
        theme={theme}
        disabled={amountError !== null || exceedsBalance || outstanding <= 0}
      />
    </ScreenWrapper>
  );
}

export function ReminderScreen({
  route,
  navigation,
  theme,
}: ReminderScreenProps) {
  const formatMoney = useCurrencyFormatter();
  const { business: activeBusiness } = useBusiness();
  const customer = mockService.getCustomer(route.params.customerId);
  const amount = mockService.getCustomerOutstandingBalance(
    route.params.customerId,
  );
  const nextDueDate = mockService
    .getCustomerTransactions(route.params.customerId)
    .find((transaction) => transaction.type === "credit" && transaction.dueDate)
    ?.dueDate;
  const templates = mockService.getReminderTemplates();
  const renderTemplate = (templateId: string) => {
    const template = templates.find((item) => item.id === templateId);
    if (!template) return "";
    return template.content
      .replaceAll("{customerName}", customer?.name ?? "Customer")
      .replaceAll("₹{amount}", formatMoney(amount))
      .replaceAll("{amount}", formatMoney(amount))
      .replaceAll(
        "{dueDate}",
        nextDueDate ? formatDate(nextDueDate) : "No due date set",
      )
      .replaceAll("{businessName}", activeBusiness.name);
  };
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    templates[0]?.id ?? "",
  );
  const [message, setMessage] = useState(() =>
    renderTemplate(templates[0]?.id ?? ""),
  );
  const [error, setError] = useState("");

  const sendReminder = () => {
    if (!customer) {
      setError("Customer could not be found.");
      return;
    }
    if (amount <= 0) {
      setError("There is no outstanding balance to remind this customer about.");
      return;
    }
    if (!message.trim()) {
      setError("Add a reminder message before sending.");
      return;
    }
    try {
      const sentAt = new Date().toISOString();
      mockService.createReminder({
        customerId: customer.id,
        amount,
        channel: "WhatsApp",
        status: "sent",
        scheduledAt: sentAt,
        sentAt,
        message: message.trim(),
      });
      setError("");
      navigation.goBack();
    } catch (sendError) {
      setError(getErrorMessage(sendError));
    }
  };

  return (
    <ScreenWrapper theme={theme} scrollable>
      <Header
        title="Send Reminder"
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <Card theme={theme}>
        <Text
          style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
        >
          Customer
        </Text>
        <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
          {customer?.name}
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          Outstanding: {formatMoney(amount)}
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          Due date: {nextDueDate ? formatDate(nextDueDate) : "Not set"}
        </Text>
      </Card>
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        WhatsApp template
      </Text>
      <View style={styles.filterRow}>
        {templates.map((template) => (
          <Pressable
            key={template.id}
            accessibilityRole="button"
            accessibilityState={{
              selected: selectedTemplateId === template.id,
            }}
            onPress={() => {
              setSelectedTemplateId(template.id);
              setMessage(renderTemplate(template.id));
            }}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedTemplateId === template.id
                    ? theme.colors.primary
                    : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedTemplateId === template.id
                      ? "#fff"
                      : theme.colors.textPrimary,
                },
              ]}
            >
              {template.name}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Message preview
      </Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        multiline
        style={[
          styles.messageInput,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.textPrimary,
          },
        ]}
      />
      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
      <View style={styles.actionRow}>
        <AppButton
          title="Send via WhatsApp"
          onPress={sendReminder}
          theme={theme}
          disabled={amount <= 0}
        />
        <AppButton
          title="Customize Message"
          onPress={() => setMessage(renderTemplate(selectedTemplateId))}
          theme={theme}
          variant="secondary"
        />
      </View>
    </ScreenWrapper>
  );
}

export function ReminderHistoryScreen({
  navigation,
  theme,
}: (
  | CompositeScreenProps<
      BottomTabScreenProps<AppTabParamList, "Reminders">,
      NativeStackScreenProps<RootStackParamList>
    >
  | NativeStackScreenProps<RootStackParamList, "ReminderHistory">
) &
  ThemeProps) {
  useRefreshOnFocus();
  const [filter, setFilter] = useState<ReminderFilter>("All");
  const reminderList = mockService.getReminders();
  const filtered = reminderList.filter(
    (item) => filter === "All" || item.status === filter.toLowerCase(),
  );

  return (
    <View
      style={[
        styles.listContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <SectionHeader title="Reminder history" theme={theme} />
      <View style={styles.filterRow}>
        {reminderFilters.map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  filter === item ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === item ? "#fff" : theme.colors.textPrimary },
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
      {filtered.map((reminder) => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          customerName={
            mockService.getCustomer(reminder.customerId)?.name ??
            "Unknown customer"
          }
          theme={theme}
        />
      ))}
    </View>
  );
}

export function ReminderAutomationScreen({
  navigation,
  theme,
}: NativeStackScreenProps<RootStackParamList, "ReminderAutomation"> &
  ThemeProps) {
  const [enabled, setEnabled] = useState(true);
  const [rules, setRules] = useState<ReminderRule[]>(() =>
    reminderRules.map((rule) => ({ ...rule })),
  );

  return (
    <ScreenWrapper theme={theme} scrollable>
      <Header
        title="Automatic Reminders"
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Automatic reminders help you follow up without having to remember every
        due date.
      </Text>
      <Card theme={theme}>
        <View style={styles.rowBetween}>
          <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
            Enable automatic reminders
          </Text>
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: enabled }}
            onPress={() => setEnabled((current) => !current)}
            style={[
              styles.toggle,
              {
                backgroundColor: enabled
                  ? theme.colors.primary
                  : theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                { marginLeft: enabled ? 26 : 4, backgroundColor: "#fff" },
              ]}
            />
          </Pressable>
        </View>
      </Card>
      {rules.map((rule) => (
        <Card key={rule.id} theme={theme}>
          <View style={styles.rowBetween}>
            <Text
              style={[styles.listTitle, { color: theme.colors.textPrimary }]}
            >
              {rule.label}
            </Text>
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{
                checked: rule.enabled,
                disabled: !enabled,
              }}
              disabled={!enabled}
              onPress={() =>
                setRules((current) =>
                  current.map((item) =>
                    item.id === rule.id
                      ? { ...item, enabled: !item.enabled }
                      : item,
                  ),
                )
              }
              style={[
                styles.toggle,
                {
                  backgroundColor: rule.enabled
                    ? theme.colors.primary
                    : theme.colors.border,
                  opacity: enabled ? 1 : 0.5,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  {
                    marginLeft: rule.enabled ? 26 : 4,
                    backgroundColor: "#fff",
                  },
                ]}
              />
            </Pressable>
          </View>
        </Card>
      ))}
      <AppButton
        title="Add Rule"
        onPress={() =>
          setRules((current) => {
            const daysAfter = current.length + 1;
            return [
              ...current,
              {
                id: `rule-${daysAfter}`,
                label: `${daysAfter} days after due date`,
                daysBeforeOrAfter: daysAfter,
                enabled: true,
              },
            ];
          })
        }
        theme={theme}
        variant="secondary"
      />
    </ScreenWrapper>
  );
}

export function PaymentLinkScreen({
  route,
  navigation,
  theme,
}: PaymentLinkScreenProps) {
  const formatMoney = useCurrencyFormatter();
  const customer = mockService.getCustomer(route.params.customerId);
  const balance = mockService.getCustomerOutstandingBalance(
    route.params.customerId,
  );
  const [amount, setAmount] = useState(String(balance));
  const [description, setDescription] = useState("Outstanding balance");
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState("");
  const parsedAmount = parseAmount(amount);
  const amountError = getAmountError(amount);
  const exceedsBalance = parsedAmount !== null && parsedAmount > balance;

  const createLink = () => {
    if (!customer) {
      setError("Customer could not be found.");
      return;
    }
    if (amountError || parsedAmount === null) {
      setError(amountError ?? "Enter a valid amount.");
      return;
    }
    if (exceedsBalance) {
      setError(
        `Payment link cannot exceed the outstanding balance of ${formatMoney(balance)}.`,
      );
      return;
    }
    try {
      const paymentLink = mockService.generatePaymentLink(
        customer.id,
        parsedAmount,
        description.trim() || "Outstanding balance",
      );
      setLink(paymentLink.url);
      setError("");
    } catch (linkError) {
      setError(getErrorMessage(linkError));
    }
  };

  return (
    <ScreenWrapper theme={theme} scrollable>
      <Header
        title="Generate Payment Link"
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
        Customer: {customer?.name}
      </Text>
      <AmountInput
        label="Amount"
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        theme={theme}
      />
      <InputField
        label="Description"
        placeholder="Outstanding payment"
        value={description}
        onChangeText={setDescription}
        theme={theme}
      />
      <AppButton
        title="Generate Payment Link"
        onPress={createLink}
        theme={theme}
        disabled={!parsedAmount || exceedsBalance}
      />
      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
      {link ? (
        <Card theme={theme}>
          <Text
            style={[styles.listMeta, { color: theme.colors.textSecondary }]}
            selectable
          >
            {link}
          </Text>
          <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
            Select and copy this link to share it with the customer.
          </Text>
        </Card>
      ) : null}
    </ScreenWrapper>
  );
}

export function PaymentHistoryScreen({
  navigation,
  theme,
}: (
  | CompositeScreenProps<
      BottomTabScreenProps<AppTabParamList, "Transactions">,
      NativeStackScreenProps<RootStackParamList>
    >
  | NativeStackScreenProps<RootStackParamList, "TransactionHistory">
) &
  ThemeProps) {
  useRefreshOnFocus();
  const payments = mockService.getPaymentHistory();

  return (
    <View
      style={[
        styles.listContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <SectionHeader title="Payment history" theme={theme} />
      {payments.map((payment) => (
        <PaymentCard
          key={payment.id}
          payment={payment}
          customerName={
            mockService.getCustomer(payment.customerId)?.name ??
            "Unknown customer"
          }
          theme={theme}
        />
      ))}
    </View>
  );
}

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

export function BusinessProfileScreen({
  navigation,
  theme,
}: BusinessProfileScreenProps) {
  const { business: currentBusiness, updateBusiness } = useBusiness();
  const [name, setName] = useState(currentBusiness.name);
  const [type, setType] = useState<BusinessType>(currentBusiness.type);
  const [phone, setPhone] = useState(currentBusiness.phone);
  const [currency, setCurrency] = useState<CurrencyCode>(
    currentBusiness.currency,
  );
  const [address, setAddress] = useState(currentBusiness.address || "");

  const handleSave = () => {
    if (!name.trim() || !isValidPhone(phone)) {
      Alert.alert(
        "Check business details",
        !name.trim()
          ? "Business name is required."
          : "Enter a valid business phone number.",
      );
      return;
    }
    updateBusiness({
      name: name.trim(),
      type,
      phone: phone.trim(),
      currency,
      address: address.trim(),
    });
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background, paddingHorizontal: 20 },
      ]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        Business Profile
      </Text>
      <InputField
        label="Business name"
        placeholder="Business name"
        value={name}
        onChangeText={setName}
        theme={theme}
      />
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Business type
      </Text>
      <View style={styles.filterRow}>
        {businessTypes.map((businessType) => (
          <Pressable
            key={businessType}
            onPress={() => setType(businessType)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  type === businessType
                    ? theme.colors.primary
                    : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    type === businessType
                      ? "#fff"
                      : theme.colors.textPrimary,
                },
              ]}
            >
              {businessType}
            </Text>
          </Pressable>
        ))}
      </View>
      <InputField
        label="Phone"
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        theme={theme}
      />
      <InputField
        label="Address"
        placeholder="Add address"
        value={address}
        onChangeText={setAddress}
        theme={theme}
        multiline
      />
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Currency
      </Text>
      <View style={styles.filterRow}>
        {currencies.map((code) => (
          <Pressable
            key={code}
            onPress={() => setCurrency(code)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  currency === code
                    ? theme.colors.primary
                    : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    currency === code ? "#fff" : theme.colors.textPrimary,
                },
              ]}
            >
              {code}
            </Text>
          </Pressable>
        ))}
      </View>
      <AppButton
        title="Save Changes"
        onPress={handleSave}
        theme={theme}
      />
    </View>
  );
}

export function WhatsAppSettingsScreen({
  navigation,
  theme,
}: NativeStackScreenProps<RootStackParamList, "WhatsAppSettings"> &
  ThemeProps) {
  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background, paddingHorizontal: 20 },
      ]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        WhatsApp Settings
      </Text>
      <Card theme={theme}>
        <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
          Connection status
        </Text>
        <StatusBadge label="Connected" tone="success" theme={theme} />
      </Card>
      <Card theme={theme}>
        <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
          Templates
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          {reminderTemplates.length} available
        </Text>
      </Card>
      <AppButton
        title="Back"
        onPress={() => navigation.goBack()}
        theme={theme}
      />
    </View>
  );
}

export function PaymentSettingsScreen({
  navigation,
  theme,
}: NativeStackScreenProps<RootStackParamList, "PaymentSettings"> & ThemeProps) {
  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background, paddingHorizontal: 20 },
      ]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        Payment Settings
      </Text>
      <Card theme={theme}>
        <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
          UPI
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          Bank transfer • Card
        </Text>
      </Card>
      <AppButton
        title="Back"
        onPress={() => navigation.goBack()}
        theme={theme}
      />
    </View>
  );
}

export function NotificationSettingsScreen({
  navigation,
  theme,
}: NativeStackScreenProps<RootStackParamList, "NotificationSettings"> &
  ThemeProps) {
  const [settings, setSettings] = useState(notificationSettings);

  const toggle = (key: keyof typeof settings) =>
    setSettings((current) => ({ ...current, [key]: !current[key] }));

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background, paddingHorizontal: 20 },
      ]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        Notifications
      </Text>
      {notificationOptions.map(({ key, label }) => (
        <Card key={key} theme={theme}>
          <View style={styles.rowBetween}>
            <Text
              style={[styles.listTitle, { color: theme.colors.textPrimary }]}
            >
              {label}
            </Text>
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: settings[key] }}
              onPress={() => toggle(key)}
              style={[
                styles.toggle,
                {
                  backgroundColor: settings[key]
                    ? theme.colors.primary
                    : theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  {
                    marginLeft: settings[key] ? 26 : 4,
                    backgroundColor: "#fff",
                  },
                ]}
              />
            </Pressable>
          </View>
        </Card>
      ))}
      <AppButton
        title="Back"
        onPress={() => navigation.goBack()}
        theme={theme}
      />
    </View>
  );
}

export function ProfileScreen({
  navigation,
  theme,
}: NativeStackScreenProps<RootStackParamList, "Profile"> & ThemeProps) {
  const { user: signedInUser, signOut } = useAuth();
  const { business: currentBusiness } = useBusiness();

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background, paddingHorizontal: 20 },
      ]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        Profile
      </Text>
      <Card theme={theme}>
        <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
          {signedInUser?.name ?? user.name}
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          {signedInUser?.phone ?? user.phone}
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          Business: {currentBusiness.name}
        </Text>
      </Card>
      <AppButton
        title="Logout"
        onPress={() => {
          signOut();
          navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
        }}
        theme={theme}
        variant="ghost"
      />
    </View>
  );
}

export function ReminderTemplateScreen({
  navigation,
  theme,
}: NativeStackScreenProps<RootStackParamList, "ReminderTemplate"> &
  ThemeProps) {
  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background, paddingHorizontal: 20 },
      ]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        Reminder Templates
      </Text>
      {reminderTemplates.map((template) => (
        <Card key={template.id} theme={theme}>
          <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
            {template.name}
          </Text>
          <Text
            style={[styles.listMeta, { color: theme.colors.textSecondary }]}
          >
            {template.content}
          </Text>
        </Card>
      ))}
      <AppButton
        title="Back"
        onPress={() => navigation.goBack()}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
