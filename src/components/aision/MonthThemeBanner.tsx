import { getMonth } from "@/lib/months";

export function MonthThemeBanner({
  date = new Date(),
  affirmation,
}: {
  date?: Date;
  affirmation?: string;
}) {
  const month = getMonth(date);
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border bg-hero p-6 shadow-elegant">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            {month.name} · Theme of the month
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-balance sm:text-3xl">
            {month.theme}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{month.focus}</p>
        </div>
        {affirmation && (
          <div className="rounded-xl border bg-surface-elevated/70 p-4 sm:max-w-xs">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Today’s affirmation
            </p>
            <p className="mt-1 font-display text-base leading-snug text-balance">
              “{affirmation}”
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
