import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomNav } from "../components/layout/BottomNav";
import {
  BusinessProfileScreen,
  PaymentHistoryScreen,
  ProfileScreen,
  RecordPaymentScreen,
  SplashScreen,
  WhatsAppSettingsScreen,
} from "../screens";
import { OtpVerificationScreen as OtpScreen } from "../screens/auth/OtpVerificationScreen";
import { PhoneLoginScreen as LoginScreen } from "../screens/auth/PhoneLoginScreen";
import { WelcomeScreen } from "../screens/auth/WelcomeScreen";
import { BusinessProfileSetupScreen as BusinessSetupScreen } from "../screens/onboarding/BusinessProfileSetupScreen";
import { CustomerDetailScreen } from "../screens/customers/CustomerDetailScreen";
import { AddCustomerScreen } from "../screens/customers/AddCustomerScreen";
import { AddTransactionScreen as AddDueScreen } from "../screens/transactions/AddTransactionScreen";
import { ReminderAutomationScreen } from "../screens/reminders/ReminderAutomationScreen";
import { ReminderListScreen as ReminderHistoryScreen } from "../screens/reminders/ReminderListScreen";
import { SendReminderScreen as ReminderScreen } from "../screens/reminders/SendReminderScreen";
import { ReminderTemplateScreen } from "../screens/reminders/ReminderTemplateScreen";
import { PaymentLinkScreen } from "../screens/payments/PaymentLinkScreen";
import { NotificationSettingsScreen } from "../screens/settings/NotificationSettingsScreen";
import { PaymentSettingsScreen } from "../screens/settings/PaymentSettingsScreen";
import type { AppTheme } from "../theme/theme";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator({
  theme,
  toggleTheme,
}: {
  theme: AppTheme;
  toggleTheme: () => void;
}) {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash">
        {(props) => (
          <SplashScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Welcome">
        {(props) => (
          <WelcomeScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Otp">
        {(props) => (
          <OtpScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Stack.Screen>
      <Stack.Screen name="BusinessSetup">
        {(props) => (
          <BusinessSetupScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AppTabs">
        {() => <BottomNav theme={theme} toggleTheme={toggleTheme} />}
      </Stack.Screen>
      <Stack.Screen name="AddCustomer">
        {(props) => (
          <AddCustomerScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="CustomerDetail">
        {(props) => (
          <CustomerDetailScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddDue">
        {(props) => (
          <AddDueScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Stack.Screen>
      <Stack.Screen name="RecordPayment">
        {(props) => (
          <RecordPaymentScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="SendReminder">
        {(props) => (
          <ReminderScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Stack.Screen>
      <Stack.Screen name="PaymentLink">
        {(props) => (
          <PaymentLinkScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="TransactionHistory">
        {(props) => (
          <PaymentHistoryScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ReminderHistory">
        {(props) => (
          <ReminderHistoryScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ReminderAutomation">
        {(props) => (
          <ReminderAutomationScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ReminderTemplate">
        {(props) => (
          <ReminderTemplateScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="BusinessProfile">
        {(props) => (
          <BusinessProfileScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="WhatsAppSettings">
        {(props) => (
          <WhatsAppSettingsScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="PaymentSettings">
        {(props) => (
          <PaymentSettingsScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="NotificationSettings">
        {(props) => (
          <NotificationSettingsScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Profile">
        {(props) => (
          <ProfileScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
