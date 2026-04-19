import { Link } from "@tanstack/react-router";

export function Logo({ to = "/", size = "md" }: { to?: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? 44 : size === "sm" ? 28 : 36;
  const titleSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";
  const subSize = size === "lg" ? "text-xs" : "text-[10px]";

  return (
    <Link to={to} className="group inline-flex items-center gap-3">
      <span
        className="relative inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elegant"
        style={{ width: dim, height: dim }}
        aria-hidden
      >
        <svg viewBox="0 0 32 32" width={dim * 0.55} height={dim * 0.55} fill="none">
          <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
          <path
            d="M16 4 L26 26 L16 21 L6 26 Z"
            fill="currentColor"
            opacity="0.95"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`font-display font-semibold tracking-tight ${titleSize}`}>AISION</span>
        <span className={`uppercase tracking-[0.22em] text-muted-foreground ${subSize}`}>
          Creative Systems
        </span>
      </span>
    </Link>
  );
}
