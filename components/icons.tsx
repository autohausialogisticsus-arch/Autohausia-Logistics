type IconProps = {
  className?: string;
};

function Base({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function SteeringWheelIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 3.2v6.3" />
      <path d="M20.4 8.1l-5.1 3" />
      <path d="M3.6 8.1l5.1 3" />
    </Base>
  );
}

export function RouteIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="5" r="2" />
      <path d="M7 17.5C11 13 13 11 17 6.5" />
    </Base>
  );
}

export function PriceTagIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M3 5a2 2 0 0 1 2-2h3.8a2 2 0 0 1 1.4.6l9.2 9.2a2 2 0 0 1 0 2.9l-3.7 3.7a2 2 0 0 1-2.9 0L3.6 10.2A2 2 0 0 1 3 8.8V5z" />
      <circle cx="8.2" cy="8.2" r="1.4" />
    </Base>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M4 5.2A1.2 1.2 0 0 1 5.2 4h13.6A1.2 1.2 0 0 1 20 5.2v8.6A1.2 1.2 0 0 1 18.8 15H9.4L5 19v-4H5.2A1.2 1.2 0 0 1 4 13.8V5.2z" />
    </Base>
  );
}

export function DocIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M6 2.5h7.2L18 7.3v14.2A1.2 1.2 0 0 1 16.8 23H6.2A1.2 1.2 0 0 1 5 21.8V3.7A1.2 1.2 0 0 1 6.2 2.5zM13.2 2.5V7.3H18" />
    </Base>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="M15.5 15.5L20 20" />
    </Base>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M4 12l5 5L20 6" />
    </Base>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </Base>
  );
}

export function PrinterIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M6 9V3.6A1.1 1.1 0 0 1 7.1 2.5h9.8A1.1 1.1 0 0 1 18 3.6V9" />
      <path d="M6 17.5H5.1A1.1 1.1 0 0 1 4 16.4v-5.3A1.1 1.1 0 0 1 5.1 10h13.8A1.1 1.1 0 0 1 20 11.1v5.3a1.1 1.1 0 0 1-1.1 1.1H18" />
      <rect x="6" y="14.5" width="12" height="7" />
    </Base>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M5 4h4l1.5 4.5-2.2 1.5a12 12 0 0 0 5.7 5.7l1.5-2.2L20 15v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1z" />
    </Base>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <rect x="4" y="5.5" width="16" height="13" rx="1.2" />
      <path d="M4.5 7l7.5 6 7.5-6" />
    </Base>
  );
}

export function TruckIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M3 16V8h9v8" />
      <rect x="6" y="10" width="11" height="2" />
      <path d="M12 14l4-2.5V9" />
      <path d="M16 14l-4 2V9" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M9 18h6" />
    </Base>
  );
}

export function UploadIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </Base>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Base>
  );
}