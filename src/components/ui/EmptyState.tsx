/**
 * EmptyState: estado vacío reutilizable.
 *
 * Patrón visual coherente para todas las páginas: tarjeta con borde sutil,
 * icono dentro de un cuadrado neutral, título y subtítulo opcional, más un
 * botón de acción opcional (p. ej. "Crear nuevo X").
 *
 * Unifica los varios "EmptyXxx" que cada módulo tenía duplicados.
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Acción principal opcional (p. ej. botón "Crear nuevo"). */
  action?: ReactNode;
  /** Tono del icono: 'neutral' (gris) o 'success' (verde, p. ej. "todo OK"). */
  tone?: "neutral" | "success";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "neutral",
  className = "",
}: EmptyStateProps) {
  const iconWrap =
    tone === "success"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-line/60 text-ink-faint";

  return (
    <div
      className={[
        "rounded-2xl border border-line bg-white px-5 py-14 shadow-card",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={[
            "mb-3 flex h-11 w-11 items-center justify-center rounded-xl",
            iconWrap,
          ].join(" ")}
        >
          <Icon size={20} />
        </div>
        <p className="text-sm font-medium text-ink-soft">{title}</p>
        {description ? (
          <p className="mt-1 max-w-sm text-xs text-ink-faint">{description}</p>
        ) : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}
