/**
 * Loader: spinner minimalista reutilizable.
 *
 * `size` controla el diámetro. Por defecto hereda el color del texto
 * (currentColor), de modo que se adapta a fondos claros u oscuros.
 */

interface LoaderProps {
  size?: number;
  className?: string;
  label?: string;
}

export function Loader({ size = 18, className = "", label }: LoaderProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin"
        style={{ animationDuration: "0.7s" }}
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeOpacity="0.2"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {label ? <span className="text-sm">{label}</span> : null}
    </span>
  );
}
