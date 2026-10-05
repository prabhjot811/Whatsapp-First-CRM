import { mockService } from "./mockServices";
import type { Transaction } from "../types";

export const transactionService = {
  list(): Transaction[] {
    return mockService.getTransactions();
  },
  listForCustomer(customerId: string): Transaction[] {
    return mockService.getCustomerTransactions(customerId);
  },
  create(
    input: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ): Transaction {
    return mockService.addTransaction(input);
  },
};
