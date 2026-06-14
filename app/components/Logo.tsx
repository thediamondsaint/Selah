export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="selah-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a5b4fc" />
          <stop offset="0.55" stopColor="#818cf8" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Rounded badge */}
      <rect width="32" height="32" rx="9" fill="url(#selah-grad)" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="8.5" stroke="#ffffff" strokeOpacity="0.12" />

      {/* Open book */}
      <g stroke="#0b0b14" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M16 12.2C13.6 10.6 10.4 10.2 8 10.8V22.4C10.4 21.8 13.6 22.2 16 23.8" />
        <path d="M16 12.2C18.4 10.6 21.6 10.2 24 10.8V22.4C21.6 21.8 18.4 22.2 16 23.8" />
        <path d="M16 12.2V23.8" strokeOpacity="0.55" />
      </g>

      {/* Light of insight */}
      <circle cx="16" cy="7" r="1.7" fill="#0b0b14" />
    </svg>
  )
}
