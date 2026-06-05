/**
 * Modal: diálogo centrado reutilizable.
 *
 * - Overlay con desenfoque y fundido; clic fuera cierra (configurable).
 * - Tecla Escape cierra.
 * - Bloquea el scroll del fondo mientras está abierto.
 * - Gestiona el foco: al abrir enfoca el panel; al cerrar restaura el foco al
 *   elemento que lo tenía antes (accesibilidad de teclado).
 * - Cabecera con título y botón de cierre; el contenido se pasa como children.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Si false, el clic en el overlay no cierra (útil durante envíos). */
  closeOnOverlay?: boolean;
  /** Clase de ancho máximo del panel (por defecto max-w-md). */
  widthClassName?: string;
}

export function Modal({
  open,
  title,
  onClose,
  children,
  closeOnOverlay = true,
  widthClassName = "max-w-md",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Cerrar con Escape + bloquear scroll del body + gestionar el foco.
  useEffect(() => {
    if (!open) return;

    const previousActive = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Enfoca el panel al abrir (tras el primer paint).
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(focusTimer);
      // Restaura el foco al disparador, si sigue en el DOM.
      previousActive?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Overlay */}
      <div
        className="animate-fade-in absolute inset-0 bg-ink/30 backdrop-blur-sm"
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Panel: alto limitado al viewport; la cabecera queda fija y el
          contenido hace scroll interno si el formulario es largo. */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={[
          "animate-scale-in relative flex max-h-[90vh] w-full flex-col rounded-2xl border border-line bg-white shadow-card outline-none",
          widthClassName,
        ].join(" ")}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-line px-6 py-4">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 rounded-lg p-1 text-ink-faint transition-colors hover:bg-line/60 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
