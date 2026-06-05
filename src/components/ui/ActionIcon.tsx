/**
 * ActionIcon: botón de acción de solo icono, con color por intención.
 *
 * Centraliza el sistema visual de "un color por acción" para que toda la app
 * identifique las acciones de un vistazo y de forma consistente:
 *   - edit    (azul)    editar
 *   - delete  (rojo)    eliminar
 *   - view    (violeta) ver detalle / boleta
 *   - account (verde)   estado de cuenta / finanzas
 *   - print   (cyan)    imprimir / descargar
 *   - neutral (gris)    acción sin connotación
 *
 * El icono ya viene coloreado en reposo (identificable) y refuerza con un
 * fondo tenue al pasar el cursor. Reenvía las props nativas de <button>.
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ActionIntent =
  | "edit"
  | "delete"
  | "view"
  | "account"
  | "print"
  | "neutral";

interface ActionIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  intent: ActionIntent;
  /** Etiqueta accesible (obligatoria: el botón es solo icono). */
  label: string;
  children: ReactNode;
}

const INTENTS: Record<ActionIntent, string> = {
  edit: "text-info hover:bg-info-soft focus-visible:ring-info/30",
  delete: "text-danger hover:bg-rose-50 focus-visible:ring-danger/30",
  view: "text-violet-600 hover:bg-violet-50 focus-visible:ring-violet-500/30",
  account: "text-success hover:bg-success-soft focus-visible:ring-success/30",
  print: "text-sky-600 hover:bg-sky-50 focus-visible:ring-sky-500/30",
  neutral:
    "text-ink-faint hover:bg-line/60 hover:text-ink focus-visible:ring-accent/30",
};

export function ActionIcon({
  intent,
  label,
  children,
  className = "",
  type = "button",
  ...rest
}: ActionIconProps) {
  return (
    <button
      type={type}
      title={label}
      aria-label={label}
      className={[
        "rounded-lg p-2 transition-all duration-200",
        "focus:outline-none focus-visible:ring-2",
        "disabled:cursor-not-allowed disabled:opacity-40",
        INTENTS[intent],
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
