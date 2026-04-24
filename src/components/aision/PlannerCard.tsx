import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "muted" | "hero";

export function PlannerCard({
  title,
  eyebrow,
  description,
  action,
  children,
  className,
  contentClassName,
  tone = "default",
}: {
  title?: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  tone?: Tone;
}) {
  const toneClass =
    tone === "hero"
      ? "bg-hero"
      : tone === "muted"
      ? "bg-card/60"
      : "bg-card/85";

  return (
    <section
      className={cn(
        "group rounded-2xl border p-6 shadow-elegant backdrop-blur-sm transition-colors sm:p-7",
        toneClass,
        className,
      )}
    >
      {(title || eyebrow || action || description) && (
        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-1 font-display text-lg font-medium tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
