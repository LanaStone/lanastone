interface LogoProps {
  className?: string;
  invert?: boolean;
}

export function Logo({ className = "", invert = false }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden="true">
        <path
          d="M14 30 C 14 22, 8 18, 6 12 C 4 7, 8 3, 14 5"
          stroke={invert ? "var(--color-lilac-soft)" : "var(--color-lilac-deep)"}
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="6.5" cy="11" r="1.6" fill={invert ? "var(--color-lilac-soft)" : "var(--color-lilac)"} />
        <circle cx="9" cy="7" r="1.3" fill={invert ? "var(--color-lilac-soft)" : "var(--color-lilac)"} opacity="0.85" />
        <circle cx="11.5" cy="4.5" r="1" fill={invert ? "var(--color-lilac-soft)" : "var(--color-gold)"} opacity="0.9" />
        <circle cx="4.2" cy="14" r="1.1" fill={invert ? "var(--color-lilac-soft)" : "var(--color-gold)"} opacity="0.7" />
      </svg>
      <div className="leading-none">
        <div
          className="script-accent text-[2.1rem] leading-none"
          style={{ color: invert ? "var(--color-cream)" : "var(--color-lilac-deep)" }}
        >
          Lana Stone
        </div>
        <div
          className="text-[0.55rem] uppercase tracking-[0.45em] mt-1"
          style={{ color: invert ? "var(--color-lilac-soft)" : "var(--color-lilac-deep)", opacity: 0.7 }}
        >
          handmade jewelry
        </div>
      </div>
    </div>
  );
}
