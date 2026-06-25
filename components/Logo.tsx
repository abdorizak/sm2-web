// Logo is the Runix mark: a terminal prompt (chevron + cursor) in brand amber.
export default function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect x="3" y="3" width="58" height="58" rx="14" fill="#0b0e17" />
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="14"
        fill="none"
        stroke="#ffc061"
        strokeWidth="2.5"
      />
      <path
        d="M19 21 L31 32 L19 43"
        fill="none"
        stroke="#ffc061"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="33" y="38.5" width="13" height="5" rx="2.5" fill="#ffc061" />
    </svg>
  );
}
