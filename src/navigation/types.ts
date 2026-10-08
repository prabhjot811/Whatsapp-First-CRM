export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Otp: { phoneNumber: string };
  BusinessSetup: undefined;
  AppTabs: undefined;
  CustomerDetail: { customerId: string };
  AddCustomer: undefined;
  AddDue: { customerId?: string } | undefined;
  RecordPayment: { customerId: string };
  SendReminder: { customerId: string };
  PaymentLink: { customerId: string };
  TransactionHistory: undefined;
  ReminderHistory: undefined;
  ReminderAutomation: undefined;
  ReminderTemplate: undefined;
  BusinessProfile: undefined;
  WhatsAppSettings: undefined;
  PaymentSettings: undefined;
  NotificationSettings: undefined;
  Profile: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Customers: undefined;
  Transactions: undefined;
  Reminders: undefined;
  Profile: undefined;
};
