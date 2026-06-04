/**
 * Button reutilizable.
 *
 * Soporta variantes visuales, ancho completo y un estado `loading` que
 * deshabilita el botón y muestra un spinner. Reenvía el resto de props
 * nativas de <button> (type, onClick, etc.).
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader } from "@/components/ui/Loader";

type Variant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-indigo-600 active:scale-[0.99] shadow-sm",
  ghost:
    "bg-transparent text-ink-soft hover:bg-accent-soft hover:text-accent",
};

export function Button({
  children,
  variant = "primary",
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
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5",
        "text-sm font-medium transition-all duration-200",
        "focus:outline-none focus-visible:shadow-focus focus-visible:ring-2 focus-visible:ring-accent/30",
        "disabled:cursor-not-allowed disabled:opacity-60",
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
