export function EcoLeafIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="swooshGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      {/* Swoosh arc */}
      <path
        d="M8 36C12 28 20 18 38 14"
        stroke="url(#swooshGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Leaf shape */}
      <path
        d="M24 8C24 8 36 12 38 24C40 36 28 42 24 42C20 42 8 36 10 24C12 12 24 8 24 8Z"
        fill="url(#leafGradient)"
      />
      {/* Leaf vein */}
      <path
        d="M24 14V34M24 20L18 26M24 26L30 32"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
    </svg>
  )
}
