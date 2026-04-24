import { useState } from "react";
import { Download, Check, Share, Plus } from "lucide-react";
import { useInstallPrompt } from "@/lib/pwa";
import { Button } from "@/components/ui/button";

export function InstallAppCard() {
  const { canInstall, installed, isIOS, promptInstall } = useInstallPrompt();
  const [showHelp, setShowHelp] = useState(false);

  if (installed) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border bg-card/85 p-5 shadow-elegant">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-primary">
          <Check className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
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
    <div className="rounded-2xl border bg-card/85 p-6 shadow-elegant">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Install
          </p>
          <p className="mt-1 font-display text-lg">Install AISION on this device</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Use the planner offline with a dedicated app icon on your phone, tablet or desktop.
          </p>
        </div>
        <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary sm:inline-flex">
          <Download className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {canInstall ? (
          <Button onClick={() => promptInstall()} className="gap-2">
            <Download className="h-4 w-4" />
            Install App
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setShowHelp((s) => !s)} className="gap-2">
            <Download className="h-4 w-4" />
            How to install
          </Button>
        )}
      </div>

      {(showHelp || (!canInstall && isIOS)) && (
        <div className="mt-4 space-y-2 rounded-xl border bg-surface/60 p-4 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <Share className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong className="text-foreground">iPhone / iPad:</strong> tap Share, then "Add to Home Screen".
            </span>
          </p>
          <p className="flex items-start gap-2">
            <Plus className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong className="text-foreground">Android Chrome:</strong> open the menu, tap "Install app".
            </span>
          </p>
          <p className="flex items-start gap-2">
            <Download className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <strong className="text-foreground">Desktop:</strong> click the install icon in the address bar.
            </span>
          </p>
          <p className="pt-1 text-xs">
            Note: install only works on the published app, not inside the editor preview.
          </p>
        </div>
      )}
    </div>
  );
}
