import { mockService } from "./mockServices";
import type { Reminder, ReminderTemplate } from "../types";

export const reminderService = {
  list(): Reminder[] {
    return mockService.getReminders();
  },
  listTemplates(): ReminderTemplate[] {
    return mockService.getReminderTemplates();
  },
  send(input: Omit<Reminder, "id">): Reminder {
    return mockService.createReminder(input);
  },
};
