/**
 * DeleteCategoriaModal: confirmación de borrado (wrapper sobre ConfirmModal).
 */

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { Categoria } from "@/types/categoria";

interface DeleteCategoriaModalProps {
  open: boolean;
  categoria?: Categoria | null;
  submitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteCategoriaModal({
  open,
  categoria,
  submitting,
  onConfirm,
  onClose,
}: DeleteCategoriaModalProps) {
  return (
    <ConfirmModal
      open={open}
      title="Eliminar categoría"
      tone="danger"
      confirmLabel="Eliminar"
      loading={submitting}
      onConfirm={onConfirm}
      onClose={onClose}
      message={
        <>
          ¿Seguro que deseas eliminar la categoría{" "}
          <span className="font-medium text-ink">{categoria?.nombre}</span>?
          Esta acción no se puede deshacer.
        </>
      }
    />
  );
}
