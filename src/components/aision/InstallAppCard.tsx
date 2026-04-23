import { useState } from "react";
import { Download, Check, Share, Plus } from "lucide-react";
import { useInstallPrompt } from "@/lib/pwa";

export function InstallAppCard() {
  const { canInstall, installed, isIOS, promptInstall } = useInstallPrompt();
  const [showHelp, setShowHelp] = useState(false);

  if (installed) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border bg-card p-5 shadow-elegant">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-primary">
          <Check className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            App installed
          </p>
          <p className="mt-0.5 font-display text-base">
            AISION Planner is ready on this device.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-elegant">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Install
          </p>
          <p className="mt-1 font-display text-lg">
            Install AISION on this device
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the planner offline with a dedicated app icon on your phone,
            tablet or desktop.
          </p>
        </div>
        <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary sm:inline-flex">
          <Download className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {canInstall ? (
          <button
            onClick={() => promptInstall()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Install App
          </button>
        ) : (
          <button
            onClick={() => setShowHelp((s) => !s)}
            className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Download className="h-4 w-4" />
            How to install
          </button>
        )}
      </div>

      {(showHelp || (!canInstall && isIOS)) && (
        <div className="mt-4 space-y-2 rounded-xl border bg-background/60 p-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            <span>
              <strong className="text-foreground">iPhone / iPad:</strong> tap
              Share, then "Add to Home Screen".
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>
              <strong className="text-foreground">Android Chrome:</strong> open
              the menu, tap "Install app" or "Add to Home screen".
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>
              <strong className="text-foreground">Desktop:</strong> click the
              install icon in the address bar (Chrome, Edge, Brave).
            </span>
          </p>
          <p className="pt-1 text-xs">
            Note: install only works on the published app, not inside the
            editor preview.
          </p>
        </div>
      )}
    </div>
  );
}
