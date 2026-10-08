export type CustomerStatus = "active" | "archived";
export type TransactionType = "credit" | "payment";
export type PaymentMethod = "UPI" | "bank-transfer" | "card" | "cash" | "other";
export type PaymentStatus = "pending" | "successful" | "failed" | "cancelled";
export type ReminderStatus =
  | "queued"
  | "sent"
  | "delivered"
  | "read"
  | "failed";
export type ReminderChannel = "WhatsApp" | "SMS" | "Call";
export type BusinessType =
  | "Retail"
  | "Wholesale"
  | "Services"
  | "Manufacturing"
  | "Other";
export type CurrencyCode = "INR" | "USD" | "AED" | "EUR";

export interface User {
  id: string;
  name: string;
  phone: string;
  businessId: string;
  createdAt: string;
}

export interface Business {
  id: string;
  ownerName?: string;
  name: string;
  type: BusinessType;
  phone: string;
  address?: string;
  currency: CurrencyCode;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  status: CustomerStatus;
}

export interface Transaction {
  id: string;
  businessId: string;
  customerId: string;
  type: TransactionType;
  amount: number;
  description: string;
  reference: string;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  businessId: string;
  customerId: string;
  transactionId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  createdAt: string;
  notes?: string;
}

export interface Reminder {
  id: string;
  customerId: string;
  amount: number;
  channel: ReminderChannel;
  status: ReminderStatus;
  scheduledAt: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failureReason?: string;
  message?: string;
}

export interface ReminderTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

export interface PaymentLink {
  id: string;
  customerId: string;
  amount: number;
  description: string;
  paymentMethods: PaymentMethod[];
  url: string;
  createdAt: string;
  expiresAt: string;
}

export interface NotificationSettings {
  paymentReceived: boolean;
  reminderNotifications: boolean;
  failedReminderNotifications: boolean;
  dailyCollectionSummary: boolean;
  weeklySummary: boolean;
}

export interface DashboardSummary {
  totalPending: number;
  dueToday: number;
  overdue: number;
  collectedThisMonth: number;
}

export interface ReminderRule {
  id: string;
  label: string;
  daysBeforeOrAfter: number;
  enabled: boolean;
}

export interface BusinessSettings {
  autoRemindersEnabled: boolean;
  reminderRules: ReminderRule[];
}

export interface ReminderSettings {
  defaultTemplateId: string;
  sendViaWhatsApp: boolean;
}

export interface Subscription {
  plan: string;
  status: "active" | "trial" | "inactive";
  nextBillingDate: string;
}

export interface BusinessProfileForm {
  businessName: string;
  businessType: BusinessType;
  phone: string;
  address: string;
  currency: CurrencyCode;
}
