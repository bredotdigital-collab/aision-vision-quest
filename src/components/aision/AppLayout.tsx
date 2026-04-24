import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarRange,
  CalendarDays,
  CalendarCheck,
  Sun,
  TrendingUp,
  Settings as SettingsIcon,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ReminderToaster } from "./ReminderToaster";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/year", label: "2026 Year", icon: CalendarRange },
  { to: "/monthly", label: "Monthly", icon: CalendarDays },
  { to: "/weekly", label: "Weekly", icon: CalendarCheck },
  { to: "/daily", label: "Daily", icon: Sun },
  { to: "/tracking", label: "Tracking", icon: TrendingUp },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b px-5">
          <Logo size="sm" to="/dashboard" />
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t p-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Powered by AISION Creative Systems
        </div>
      </aside>

      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur lg:px-8">
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
            <div className="hidden lg:block">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                AISION · 2026 Planner
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
          </div>
        </header>

        <main className="flex-1 px-4 py-8 lg:px-10 lg:py-12">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>

        <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground lg:px-10">
          Powered by <span className="font-medium text-foreground">AISION Creative Systems</span>
        </footer>
      </div>
      <Toaster />
      <ReminderToaster />
    </div>
  );
}
