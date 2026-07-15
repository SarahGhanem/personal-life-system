export function PlannerIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 180"
      className={className}
      role="img"
      aria-label="An open notebook next to a small potted plant"
    >
      <circle cx="205" cy="35" r="3" fill="var(--color-social)" opacity="0.75" />
      <circle cx="16" cy="24" r="2.5" fill="var(--color-career)" opacity="0.7" />
      <circle cx="192" cy="142" r="2.5" fill="var(--color-accent)" opacity="0.7" />

      <g transform="rotate(-4 75 85)">
        <rect x="20" y="40" width="110" height="90" rx="6" fill="var(--sand-3)" />
      </g>

      <g transform="rotate(3 85 90)">
        <rect x="30" y="45" width="110" height="90" rx="6" fill="white" stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1="45" y1="70" x2="115" y2="70" stroke="var(--sand-4)" strokeWidth="2" strokeLinecap="round" />
        <line x1="45" y1="85" x2="105" y2="85" stroke="var(--sand-4)" strokeWidth="2" strokeLinecap="round" />
        <line x1="45" y1="100" x2="110" y2="100" stroke="var(--sand-4)" strokeWidth="2" strokeLinecap="round" />
        <rect x="45" y="112" width="15" height="15" rx="3" fill="var(--color-accent-soft)" stroke="var(--color-accent)" strokeWidth="1.5" />
        <path d="M48 119.5 L51.5 123.5 L58 114" stroke="var(--color-accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <g transform="translate(150 58)">
        <path d="M10 70 L54 70 L48 100 L16 100 Z" fill="var(--choco-6)" />
        <rect x="6" y="62" width="52" height="10" rx="3" fill="var(--choco-7)" />
        <path d="M32 62 C10 55 8 25 30 15 C35 40 34 52 32 62 Z" fill="var(--color-health)" />
        <path d="M32 62 C54 52 60 22 38 10 C30 35 30 50 32 62 Z" fill="var(--green-7)" />
        <path d="M32 62 C24 45 20 30 32 18 C42 32 40 48 32 62 Z" fill="var(--green-5)" />
        <circle cx="46" cy="28" r="4" fill="var(--color-personal)" />
      </g>
    </svg>
  );
}
