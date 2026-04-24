import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useReminders,
  useNotificationPermission,
  type Frequency,
  type Reminder,
} from "@/lib/reminders";
import { Bell, BellOff, Check, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_app/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders · AISION" },
      { name: "description", content: "Set gentle reminders for planning, reflection and habits." },
    ],
  }),
  component: RemindersPage,
});

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function RemindersPage() {
  const { reminders, update } = useReminders();
  const { supported, permission, request } = useNotificationPermission();

  return (
    <>
      <PageHeader
        eyebrow="Reminders"
        title="Gentle nudges, on your terms"
        description="Choose what to be reminded about and when. Reminders appear in-app and—if you allow it—as browser notifications."
      />

      <NotificationBanner supported={supported} permission={permission} onRequest={request} />

      <div className="mt-6 grid gap-4">
        {reminders.map((r) => (
          <ReminderRow key={r.id} reminder={r} onChange={(patch) => update(r.id, patch)} />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Reminders run while AISION is open. For background notifications, install the app and keep it
        in the dock.
      </p>
    </>
  );
}

function NotificationBanner({
  supported,
  permission,
  onRequest,
}: {
  supported: boolean;
  permission: NotificationPermission | "unsupported";
  onRequest: () => Promise<unknown>;
}) {
  if (!supported) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl border bg-muted/40 p-4 text-sm">
        <AlertCircle className="mt-0.5 h-4 w-4 text-muted-foreground" />
        <div>
          <p className="font-medium">Browser notifications unavailable</p>
          <p className="text-muted-foreground">
            Your browser doesn't support notifications. In-app reminders will still appear.
          </p>
        </div>
      </div>
    );
  }
  if (permission === "granted") {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-2xl border bg-brand-soft p-4 text-sm">
        <Check className="h-4 w-4 text-primary" />
        <p>
          <span className="font-medium">Notifications enabled.</span>{" "}
          <span className="text-muted-foreground">You'll receive reminders even in other tabs.</span>
        </p>
      </div>
    );
  }
  if (permission === "denied") {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl border bg-muted/40 p-4 text-sm">
        <BellOff className="mt-0.5 h-4 w-4 text-muted-foreground" />
        <div>
          <p className="font-medium">Notifications blocked</p>
          <p className="text-muted-foreground">
            Enable notifications for this site in your browser settings to receive alerts in the
            background.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-elegant">
      <div className="flex items-start gap-3">
        <Bell className="mt-0.5 h-4 w-4 text-primary" />
        <div className="text-sm">
          <p className="font-medium">Allow browser notifications</p>
          <p className="text-muted-foreground">Get reminders even when AISION is in the background.</p>
        </div>
      </div>
      <Button size="sm" onClick={() => void onRequest()}>
        Enable notifications
      </Button>
    </div>
  );
}

function ReminderRow({
  reminder,
  onChange,
}: {
  reminder: Reminder;
  onChange: (patch: Partial<Reminder>) => void;
}) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-elegant">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-base font-medium">{reminder.label}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{reminder.description}</p>
        </div>
        <Switch
          checked={reminder.enabled}
          onCheckedChange={(v) => onChange({ enabled: v })}
          aria-label={`Toggle ${reminder.label}`}
        />
      </div>

      {reminder.enabled && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Field label="Frequency">
            <Select
              value={reminder.frequency}
              onValueChange={(v: Frequency) => onChange({ frequency: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {reminder.frequency === "weekly" && (
            <Field label="Day of week">
              <Select
                value={String(reminder.weekday ?? 0)}
                onValueChange={(v) => onChange({ weekday: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEEKDAYS.map((d, i) => (
                    <SelectItem key={d} value={String(i)}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          {reminder.frequency === "monthly" && (
            <Field label="Day of month">
              <Select
                value={String(reminder.monthday ?? 1)}
                onValueChange={(v) => onChange({ monthday: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          <Field label="Time">
            <Input
              type="time"
              value={reminder.time}
              onChange={(e) => onChange({ time: e.target.value })}
            />
          </Field>
        </div>
      )}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
