import { mockService } from "./mockServices";
import type { Customer } from "../types";

export const customerService = {
  list(): Customer[] {
    return mockService.getCustomers();
  },
  getById(id: string): Customer | undefined {
    return mockService.getCustomer(id);
  },
  getOutstandingBalance(customerId: string): number {
    return mockService.getCustomerOutstandingBalance(customerId);
  },
  create(
    input: Omit<Customer, "id" | "createdAt" | "updatedAt" | "status">,
  ): Customer {
    return mockService.createCustomer(input);
  },
};
