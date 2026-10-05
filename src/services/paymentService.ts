import { mockService } from "./mockServices";
import type { Payment, PaymentLink } from "../types";

export const paymentService = {
  list(): Payment[] {
    return mockService.getPaymentHistory();
  },
  record(input: Omit<Payment, "id" | "createdAt">): Payment {
    return mockService.recordPayment(input);
  },
  createLink(
    customerId: string,
    amount: number,
    description: string,
  ): PaymentLink {
    return mockService.generatePaymentLink(customerId, amount, description);
  },
};
