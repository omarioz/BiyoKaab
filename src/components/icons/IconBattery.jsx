export const IconBattery = ({ className = "w-5 h-5", percent = 100, ...props }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect x="2" y="7" width="16" height="10" rx="2" strokeWidth={2} />
    <rect x="4" y="9" width={12 * (percent / 100)} height="6" fill="currentColor" />
    <path d="M20 10v4" strokeWidth={2} strokeLinecap="round" />
  </svg>
);



