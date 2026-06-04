/**
 * ConfirmModal: modal de confirmación reutilizable.
 *
 * Sustituye los modales ad-hoc Delete<Recurso>Modal por una sola pieza. Se
 * usa para eliminar, cancelar ventas, cerrar sesión y cualquier otra acción
 * crítica.
 *
 * El `tone` controla el color del botón principal: "danger" para borrado
 * (rojo) y "primary" para confirmaciones neutras.
 */

import type { ReactNode } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  /** Mensaje principal. Acepta texto o nodos (para resaltar nombres). */
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" pinta el botón principal en rojo; "primary" en tinta. */
  tone?: "danger" | "primary";
  /** Cargando: deshabilita botones y muestra spinner. */
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "primary",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  // Botón principal: danger usa un estilo distinto al Button por defecto.
  const confirmBtn =
    tone === "danger" ? (
      <button
        type="button"
        onClick={onConfirm}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-danger px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader size={16} /> : null}
        {confirmLabel}
      </button>
    ) : (
      <Button onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    );

  return (
    <Modal open={open} title={title} onClose={onClose} closeOnOverlay={!loading}>
      <div className="text-sm text-ink-soft">{message}</div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        {confirmBtn}
      </div>
    </Modal>
  );
}
