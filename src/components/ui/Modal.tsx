/**
 * Modal: diálogo centrado reutilizable.
 *
 * - Overlay con desenfoque; clic fuera cierra (configurable).
 * - Tecla Escape cierra.
 * - Bloquea el scroll del fondo mientras está abierto.
 * - Cabecera con título y botón de cierre; el contenido se pasa como children.
 */

import { useEffect, type ReactNode } from "react";
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
  // Cerrar con Escape + bloquear scroll del body mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
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
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Panel: alto limitado al viewport; la cabecera queda fija y el
          contenido hace scroll interno si el formulario es largo. */}
      <div
        className={[
          "animate-fade-up relative flex max-h-[90vh] w-full flex-col rounded-2xl border border-line bg-white shadow-card",
          widthClassName,
        ].join(" ")}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-line px-6 py-4">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 rounded-lg p-1 text-ink-faint transition-colors hover:bg-line/60 hover:text-ink"
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
