import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PlannerCard({
  title,
  eyebrow,
  action,
  children,
  className,
  contentClassName,
}: {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section
      className={cn(
        "group rounded-2xl border bg-card/80 p-6 shadow-elegant backdrop-blur-sm transition-colors sm:p-7",
        className,
      )}
    >
      {(title || eyebrow || action) && (
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
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
