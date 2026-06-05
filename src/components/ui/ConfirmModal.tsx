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
  return (
    <Modal open={open} title={title} onClose={onClose} closeOnOverlay={!loading}>
      <div className="text-sm text-ink-soft">{message}</div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={tone === "danger" ? "danger" : "primary"}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
