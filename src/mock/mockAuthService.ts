import { user } from "./data";
import { isValidPhone } from "../utils/validators";
import type { User } from "../types";

const demoOtp = "123456";

export const mockAuthService = {
  requestOtp(phone: string): void {
    if (!isValidPhone(phone)) {
      throw new Error("Enter a valid phone number.");
    }
  },

  verifyOtp(phone: string, otp: string): User {
    if (!isValidPhone(phone)) {
      throw new Error("Enter a valid phone number.");
    }
    if (otp !== demoOtp) {
      throw new Error("That verification code is incorrect. Try 123456.");
    }
    return { ...user, phone };
  },
};
