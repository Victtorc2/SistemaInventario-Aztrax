/**
 * DeleteProveedorModal: confirmación de borrado (wrapper sobre ConfirmModal).
 */

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { Proveedor } from "@/types/proveedor";

interface DeleteProveedorModalProps {
  open: boolean;
  proveedor?: Proveedor | null;
  submitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteProveedorModal({
  open,
  proveedor,
  submitting,
  onConfirm,
  onClose,
}: DeleteProveedorModalProps) {
  return (
    <ConfirmModal
      open={open}
      title="Eliminar proveedor"
      tone="danger"
      confirmLabel="Eliminar"
      loading={submitting}
      onConfirm={onConfirm}
      onClose={onClose}
      message={
        <>
          ¿Deseas eliminar el proveedor{" "}
          <span className="font-medium text-ink">{proveedor?.nombre}</span>?
          Esta acción no se puede deshacer.
        </>
      }
    />
  );
}
