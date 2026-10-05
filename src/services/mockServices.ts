import {
  business,
  customers as seedCustomers,
  paymentLinks as seedPaymentLinks,
  payments as seedPayments,
  reminders as seedReminders,
  reminderTemplates,
  transactions as seedTransactions,
} from "../mock/data";
import {
  type Business,
  type Customer,
  type DashboardSummary,
  type Payment,
  type PaymentLink,
  type Reminder,
  type ReminderTemplate,
  type Transaction,
} from "../types";
import { formatCurrency } from "../utils/currencyFormatter";

export { formatCurrency };

class MockDuesMateService {
  private idSequence = 0;
  private customers: Customer[] = [...seedCustomers];
  private transactions: Transaction[] = [...seedTransactions];
  private payments: Payment[] = [...seedPayments];
  private reminders: Reminder[] = [...seedReminders];
  private paymentLinks: PaymentLink[] = [...seedPaymentLinks];

  getBusiness(): Business {
    return { ...business };
  }

  getDashboardSummary(): DashboardSummary {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let dueToday = 0;
    let overdue = 0;
    for (const customer of this.customers) {
      const openCredits = this.getOpenCredits(customer.id);
      for (const credit of openCredits) {
        if (!credit.dueDate) continue;
        const dueDate = new Date(credit.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        if (dueDate.getTime() === today.getTime()) dueToday += credit.amount;
        if (dueDate < today) overdue += credit.amount;
      }
    }

    const collectedThisMonth = this.payments.reduce((total, payment) => {
      const date = new Date(payment.createdAt);
      return payment.status === "successful" &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
        ? total + payment.amount
        : total;
    }, 0);

    return {
      totalPending: this.customers.reduce(
        (total, customer) =>
          total + this.getCustomerOutstandingBalance(customer.id),
        0,
      ),
      dueToday,
      overdue,
      collectedThisMonth,
    };
  }

  getCustomers(): Customer[] {
    return [...this.customers];
  }

  getCustomer(id: string): Customer | undefined {
    return this.customers.find((customer) => customer.id === id);
  }

  getCustomerTransactions(customerId: string): Transaction[] {
    return this.transactions
      .filter((transaction) => transaction.customerId === customerId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  getTransactions(): Transaction[] {
    return [...this.transactions].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  getCustomerPayments(customerId: string): Payment[] {
    return this.payments
      .filter((payment) => payment.customerId === customerId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  getReminders(): Reminder[] {
    return [...this.reminders];
  }

  getReminderTemplates(): ReminderTemplate[] {
    return [...reminderTemplates];
  }

  getPaymentHistory(): Payment[] {
    return [...this.payments];
  }

  getPaymentLinks(): PaymentLink[] {
    return [...this.paymentLinks];
  }

  createCustomer(
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt" | "status">,
  ): Customer {
    const name = customer.name.trim();
    const phone = customer.phone.trim();
    if (!name) throw new Error("Customer name is required.");
    if (!/^\+?[0-9][0-9\s()-]{8,18}$/.test(phone)) {
      throw new Error("Enter a valid customer phone number.");
    }

    const now = new Date().toISOString();
    const nextCustomer: Customer = {
      id: `cust-${Date.now()}`,
      businessId: customer.businessId,
      name,
      phone,
      email: customer.email?.trim() || undefined,
      notes: customer.notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
      status: "active",
    };
    this.customers = [nextCustomer, ...this.customers];
    return nextCustomer;
  }

  addTransaction(
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ): Transaction {
    this.assertValidAmount(transaction.amount, "Transaction");
    if (!this.getCustomer(transaction.customerId)) {
      throw new Error("Cannot create a transaction for an unknown customer.");
    }
    if (
      transaction.type === "payment" &&
      transaction.amount > this.getCustomerOutstandingBalance(transaction.customerId)
    ) {
      throw new RangeError("Payment cannot exceed the customer's outstanding balance.");
    }

    const now = new Date().toISOString();
    const nextTransaction: Transaction = {
      ...transaction,
      id: this.createId("txn"),
      createdAt: now,
      updatedAt: now,
    };
    this.transactions = [nextTransaction, ...this.transactions];
    return nextTransaction;
  }

  recordPayment(payment: Omit<Payment, "id" | "createdAt">): Payment {
    this.assertValidAmount(payment.amount, "Payment");
    if (!this.getCustomer(payment.customerId)) {
      throw new Error("Cannot record a payment for an unknown customer.");
    }
    const outstanding = this.getCustomerOutstandingBalance(payment.customerId);
    if (outstanding <= 0) {
      throw new Error("This customer has no outstanding balance.");
    }
    if (Math.round(payment.amount * 100) > Math.round(outstanding * 100)) {
      throw new RangeError(
        `Payment cannot exceed the outstanding balance of ${formatCurrency(outstanding)}.`,
      );
    }

    const createdAt = new Date().toISOString();
    const nextPayment: Payment = {
      ...payment,
      id: this.createId("pay"),
      reference: payment.reference.trim() || this.createId("PAY"),
      createdAt,
    };
    this.payments = [nextPayment, ...this.payments];

    if (nextPayment.status === "successful") {
      this.transactions = [
        {
          id: `txn-payment-${nextPayment.id}`,
          businessId: nextPayment.businessId,
          customerId: nextPayment.customerId,
          type: "payment",
          amount: nextPayment.amount,
          description: `Payment received via ${nextPayment.paymentMethod}`,
          reference: nextPayment.reference,
          createdAt,
          updatedAt: createdAt,
        },
        ...this.transactions,
      ];
    }
    return nextPayment;
  }

  generatePaymentLink(
    customerId: string,
    amount: number,
    description: string,
  ): PaymentLink {
    if (!this.getCustomer(customerId)) {
      throw new Error("Cannot create a payment link for an unknown customer.");
    }
    this.assertValidAmount(amount, "Payment link");
    if (amount > this.getCustomerOutstandingBalance(customerId)) {
      throw new RangeError("Payment link cannot exceed the outstanding balance.");
    }

    const nextLink: PaymentLink = {
      id: this.createId("plink"),
      customerId,
      amount,
      description,
      paymentMethods: ["UPI", "bank-transfer", "card"],
      url: `https://duesmate.app/pay/${this.createId("link")}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    };
    this.paymentLinks = [nextLink, ...this.paymentLinks];
    return nextLink;
  }

  createReminder(reminder: Omit<Reminder, "id">): Reminder {
    if (!this.getCustomer(reminder.customerId)) {
      throw new Error("Cannot create a reminder for an unknown customer.");
    }
    this.assertValidAmount(reminder.amount, "Reminder");
    const nextReminder: Reminder = {
      ...reminder,
      id: this.createId("rem"),
    };
    this.reminders = [nextReminder, ...this.reminders];
    return nextReminder;
  }

  getCustomerOutstandingBalance(customerId: string): number {
    const customerTransactions = this.getCustomerTransactions(customerId);
    const balanceCents = customerTransactions.reduce(
      (total, transaction) =>
        total +
        Math.round(transaction.amount * 100) *
          (transaction.type === "credit" ? 1 : -1),
      0,
    );
    return Math.max(0, balanceCents) / 100;
  }

  getCustomerOverdueBalance(customerId: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.getOpenCredits(customerId).reduce((total, credit) => {
      if (!credit.dueDate) return total;
      const dueDate = new Date(credit.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today ? total + credit.amount : total;
    }, 0);
  }

  getCustomerDueTodayBalance(customerId: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.getOpenCredits(customerId).reduce((total, credit) => {
      if (!credit.dueDate) return total;
      const dueDate = new Date(credit.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime()
        ? total + credit.amount
        : total;
    }, 0);
  }

  private getOpenCredits(customerId: string): {
    dueDate?: string;
    amount: number;
  }[] {
    const credits = this.transactions
      .filter(
        (transaction) =>
          transaction.customerId === customerId &&
          transaction.type === "credit",
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .map((transaction) => ({
        dueDate: transaction.dueDate,
        amountCents: Math.round(transaction.amount * 100),
      }));
    const successfulPaymentCents = this.transactions
      .filter(
        (transaction) =>
          transaction.customerId === customerId &&
          transaction.type === "payment",
      )
      .reduce((total, transaction) => total + Math.round(transaction.amount * 100), 0);

    let remainingPayments = successfulPaymentCents;
    for (const credit of credits) {
      const applied = Math.min(credit.amountCents, remainingPayments);
      credit.amountCents -= applied;
      remainingPayments -= applied;
    }
    return credits
      .filter((credit) => credit.amountCents > 0)
      .map((credit) => ({
        dueDate: credit.dueDate,
        amount: credit.amountCents / 100,
      }));
  }

  private assertValidAmount(amount: number, label: string): void {
    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      Math.round(amount * 100) !== amount * 100
    ) {
      throw new RangeError(
        `${label} amount must be positive with no more than two decimal places.`,
      );
    }
  }

  private createId(prefix: string): string {
    this.idSequence += 1;
    return `${prefix}-${Date.now().toString(36)}-${this.idSequence}`;
  }
}

export const mockService = new MockDuesMateService();
