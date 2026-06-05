/**
 * Button reutilizable.
 *
 * Soporta variantes visuales (primary, secondary, ghost, danger), dos tamaños,
 * ancho completo y un estado `loading` que deshabilita el botón y muestra un
 * spinner. Reenvía el resto de props nativas de <button> (type, onClick, etc.).
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader } from "@/components/ui/Loader";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success"
  | "info"
  | "warning";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-indigo-600 active:scale-[0.99] shadow-sm",
  secondary:
    "bg-white text-ink-soft border border-line hover:border-accent/40 hover:text-accent active:scale-[0.99]",
  ghost: "bg-transparent text-ink-soft hover:bg-accent-soft hover:text-accent",
  danger:
    "bg-danger text-white hover:bg-rose-700 active:scale-[0.99] shadow-sm",
  success:
    "bg-success text-white hover:bg-emerald-700 active:scale-[0.99] shadow-sm",
  info: "bg-info text-white hover:bg-blue-700 active:scale-[0.99] shadow-sm",
  warning:
    "bg-amber-600 text-white hover:bg-amber-700 active:scale-[0.99] shadow-sm",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={[
        "inline-flex items-center justify-center rounded-lg font-medium",
        "transition-all duration-200",
        "focus:outline-none focus-visible:shadow-focus focus-visible:ring-2 focus-visible:ring-accent/30",
        "disabled:cursor-not-allowed disabled:opacity-60",
        SIZES[size],
        VARIANTS[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? <Loader size={16} /> : null}
      {children}
    </button>
  );
}
