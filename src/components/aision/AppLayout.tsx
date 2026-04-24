import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarRange,
  CalendarDays,
  CalendarCheck,
  Sun,
  TrendingUp,
  Bell,
  Settings as SettingsIcon,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ReminderToaster } from "./ReminderToaster";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  to: "/dashboard" | "/year" | "/monthly" | "/weekly" | "/daily" | "/tracking" | "/reminders" | "/settings";
  label: string;
  icon: typeof LayoutDashboard;
};

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Plan",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/year", label: "2026 Year", icon: CalendarRange },
      { to: "/monthly", label: "Monthly", icon: CalendarDays },
      { to: "/weekly", label: "Weekly", icon: CalendarCheck },
      { to: "/daily", label: "Daily", icon: Sun },
    ],
  },
  {
    label: "Grow",
    items: [
      { to: "/tracking", label: "Tracking", icon: TrendingUp },
      { to: "/reminders", label: "Reminders", icon: Bell },
      { to: "/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border/70 px-5">
          <Logo size="sm" to="/dashboard" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-6 last:mb-0">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.to;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        {active && (
                          <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-r-full bg-sidebar-primary" />
                        )}
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            active ? "text-sidebar-primary" : "text-muted-foreground",
                          )}
                          strokeWidth={1.75}
                        />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border/70 px-5 py-4 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          AISION Creative Systems
        </div>
      </aside>

      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border/60 bg-background/75 px-4 backdrop-blur-md lg:px-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <p className="hidden text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground lg:block">
              AISION · 2026 Planner
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-border/60 px-4 py-6 text-center text-[11px] tracking-wide text-muted-foreground lg:px-10">
          Powered by <span className="font-medium text-foreground">AISION Creative Systems</span>
        </footer>
      </div>
      <Toaster />
      <ReminderToaster />
    </div>
  );
}
