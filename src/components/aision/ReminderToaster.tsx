import { useEffect } from "react";
import { toast } from "sonner";
import { onReminderAlert, useReminderScheduler } from "@/lib/reminders";

export function ReminderToaster() {
  useReminderScheduler();

  useEffect(() => {
    const off = onReminderAlert((alert) => {
      toast(alert.label, {
        description: alert.description,
        duration: 8000,
      });
    });
    return () => {
      off();
    };
  }, []);

  return null;
}
