import {
  type Business,
  type Customer,
  type DashboardSummary,
  type NotificationSettings,
  type Payment,
  type PaymentLink,
  type Reminder,
  type ReminderRule,
  type ReminderSettings,
  type ReminderTemplate,
  type Subscription,
  type Transaction,
  type User,
} from "../types";

export const user: User = {
  id: "user-1",
  name: "Raj Verma",
  phone: "+91 98765 43210",
  businessId: "business-1",
  createdAt: "2024-01-12T08:00:00.000Z",
};

export const business: Business = {
  id: "business-1",
  name: "Verma Electronics",
  type: "Retail",
  phone: "+91 98765 43210",
  address: "Sector 18, Noida, UP",
  currency: "INR",
  createdAt: "2024-01-11T09:00:00.000Z",
  updatedAt: "2024-08-10T10:30:00.000Z",
};

export const customers: Customer[] = [
  {
    id: "cust-1",
    businessId: "business-1",
    name: "Raj Kumar",
    phone: "+91 98200 11001",
    email: "raj.kumar@example.com",
    notes: "Prefers UPI payment",
    createdAt: "2024-02-03T09:00:00.000Z",
    updatedAt: "2024-08-06T11:00:00.000Z",
    status: "active",
  },
  {
    id: "cust-2",
    businessId: "business-1",
    name: "Amit Traders",
    phone: "+91 98200 11002",
    email: "amit@traders.in",
    notes: "Large order, pays on due date",
    createdAt: "2024-02-20T11:20:00.000Z",
    updatedAt: "2024-08-02T15:30:00.000Z",
    status: "active",
  },
  {
    id: "cust-3",
    businessId: "business-1",
    name: "Rahul Mehta",
    phone: "+91 98200 11003",
    email: "rahul@gmail.com",
    notes: "Requires reminder follow-up",
    createdAt: "2024-03-15T10:00:00.000Z",
    updatedAt: "2024-08-05T18:00:00.000Z",
    status: "active",
  },
  {
    id: "cust-4",
    businessId: "business-1",
    name: "Sonia Fashion",
    phone: "+91 98200 11004",
    createdAt: "2024-04-10T12:30:00.000Z",
    updatedAt: "2024-08-08T09:00:00.000Z",
    status: "active",
  },
  {
    id: "cust-5",
    businessId: "business-1",
    name: "Nitin Bhatia",
    phone: "+91 98200 11005",
    createdAt: "2024-05-15T12:00:00.000Z",
    updatedAt: "2024-07-15T10:00:00.000Z",
    status: "archived",
  },
];

export const transactions: Transaction[] = [
  {
    id: "txn-1",
    businessId: "business-1",
    customerId: "cust-1",
    type: "credit",
    amount: 50000,
    description: "Invoice 1023",
    reference: "INV-1023",
    dueDate: "2026-10-01T00:00:00.000Z",
    createdAt: "2026-09-10T08:30:00.000Z",
    updatedAt: "2026-09-10T08:30:00.000Z",
  },
  {
    id: "txn-2",
    businessId: "business-1",
    customerId: "cust-1",
    type: "payment",
    amount: 7500,
    description: "UPI payment received",
    reference: "UPI-9001",
    createdAt: "2026-09-15T11:25:00.000Z",
    updatedAt: "2026-09-15T11:25:00.000Z",
  },
  {
    id: "txn-3",
    businessId: "business-1",
    customerId: "cust-2",
    type: "credit",
    amount: 64000,
    description: "Bulk order invoice",
    reference: "INV-2188",
    dueDate: "2026-10-10T00:00:00.000Z",
    createdAt: "2026-09-12T09:00:00.000Z",
    updatedAt: "2026-09-12T09:00:00.000Z",
  },
  {
    id: "txn-4",
    businessId: "business-1",
    customerId: "cust-3",
    type: "credit",
    amount: 85000,
    description: "Product purchase",
    reference: "INV-4408",
    dueDate: "2026-09-24T00:00:00.000Z",
    createdAt: "2026-09-08T13:15:00.000Z",
    updatedAt: "2026-09-08T13:15:00.000Z",
  },
  {
    id: "txn-5",
    businessId: "business-1",
    customerId: "cust-3",
    type: "payment",
    amount: 7000,
    description: "Bank transfer received",
    reference: "BANK-9188",
    createdAt: "2026-09-20T08:50:00.000Z",
    updatedAt: "2026-09-20T08:50:00.000Z",
  },
];

export const payments: Payment[] = [
  {
    id: "pay-1",
    businessId: "business-1",
    customerId: "cust-1",
    transactionId: "txn-2",
    amount: 7500,
    paymentMethod: "UPI",
    status: "successful",
    reference: "UPI-9001",
    createdAt: "2026-09-15T11:25:00.000Z",
    notes: "Partial payment recorded",
  },
  {
    id: "pay-2",
    businessId: "business-1",
    customerId: "cust-3",
    transactionId: "txn-4",
    amount: 7000,
    paymentMethod: "bank-transfer",
    status: "successful",
    reference: "BANK-9188",
    createdAt: "2026-09-20T08:50:00.000Z",
    notes: "Payment against invoice 4408",
  },
  {
    id: "pay-3",
    businessId: "business-1",
    customerId: "cust-3",
    amount: 3500,
    paymentMethod: "cash",
    status: "pending",
    reference: "CASH-7103",
    createdAt: "2026-09-27T09:00:00.000Z",
    notes: "Awaiting confirmation",
  },
];

export const reminders: Reminder[] = [
  {
    id: "rem-1",
    customerId: "cust-1",
    amount: 8500,
    channel: "WhatsApp",
    status: "sent",
    scheduledAt: "2026-09-19T10:00:00.000Z",
    sentAt: "2026-09-19T10:02:00.000Z",
  },
  {
    id: "rem-2",
    customerId: "cust-2",
    amount: 12000,
    channel: "WhatsApp",
    status: "delivered",
    scheduledAt: "2026-09-21T11:00:00.000Z",
    sentAt: "2026-09-21T11:02:00.000Z",
    deliveredAt: "2026-09-21T11:12:00.000Z",
  },
  {
    id: "rem-3",
    customerId: "cust-3",
    amount: 8500,
    channel: "WhatsApp",
    status: "read",
    scheduledAt: "2026-09-22T08:00:00.000Z",
    sentAt: "2026-09-22T08:02:00.000Z",
    deliveredAt: "2026-09-22T08:10:00.000Z",
    readAt: "2026-09-22T08:21:00.000Z",
  },
  {
    id: "rem-4",
    customerId: "cust-4",
    amount: 16000,
    channel: "WhatsApp",
    status: "failed",
    scheduledAt: "2026-09-23T09:00:00.000Z",
    failureReason: "Customer number not reachable",
  },
];

export const reminderRules: ReminderRule[] = [
  {
    id: "rule-1",
    label: "1 day before due date",
    daysBeforeOrAfter: -1,
    enabled: true,
  },
  { id: "rule-2", label: "On due date", daysBeforeOrAfter: 0, enabled: true },
  {
    id: "rule-3",
    label: "3 days after due date",
    daysBeforeOrAfter: 3,
    enabled: true,
  },
  {
    id: "rule-4",
    label: "7 days after due date",
    daysBeforeOrAfter: 7,
    enabled: false,
  },
];

export const reminderSettings: ReminderSettings = {
  defaultTemplateId: "tpl-1",
  sendViaWhatsApp: true,
};

export const notificationSettings: NotificationSettings = {
  paymentReceived: true,
  reminderNotifications: true,
  failedReminderNotifications: true,
  dailyCollectionSummary: true,
  weeklySummary: false,
};

export const reminderTemplates: ReminderTemplate[] = [
  {
    id: "tpl-1",
    name: "Friendly Reminder",
    content:
      "Hi {customerName},\n\nThis is a friendly reminder that ₹{amount} is pending.\nDue date: {dueDate}\n\nThank you,\n{businessName}",
    variables: ["customerName", "amount", "dueDate", "businessName"],
  },
  {
    id: "tpl-2",
    name: "Payment Link Reminder",
    content:
      "Hi {customerName},\nYour payment of {amount} is still pending. Please reply if you would like a payment link.\n\nThanks,\n{businessName}",
    variables: ["customerName", "amount", "businessName"],
  },
];

export const paymentLinks: PaymentLink[] = [
  {
    id: "plink-1",
    customerId: "cust-1",
    amount: 8500,
    description: "Outstanding balance",
    paymentMethods: ["UPI", "bank-transfer", "card"],
    url: "https://duesmate.app/pay/8A9KQ1",
    createdAt: "2026-09-21T10:00:00.000Z",
    expiresAt: "2026-09-28T10:00:00.000Z",
  },
];

export const subscription: Subscription = {
  plan: "Growth",
  status: "active",
  nextBillingDate: "2026-11-01T00:00:00.000Z",
};

export const dashboardSummary: DashboardSummary = {
  totalPending: 184500,
  dueToday: 42500,
  overdue: 78000,
  collectedThisMonth: 0,
};
