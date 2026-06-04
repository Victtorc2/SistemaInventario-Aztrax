/**
 * DeleteProductoModal: confirmación de borrado (wrapper sobre ConfirmModal).
 */

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { Producto } from "@/types/producto";

interface DeleteProductoModalProps {
  open: boolean;
  producto?: Producto | null;
  submitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteProductoModal({
  open,
  producto,
  submitting,
  onConfirm,
  onClose,
}: DeleteProductoModalProps) {
  return (
    <ConfirmModal
      open={open}
      title="Eliminar producto"
      tone="danger"
      confirmLabel="Eliminar"
      loading={submitting}
      onConfirm={onConfirm}
      onClose={onClose}
      message={
        <>
          ¿Deseas eliminar el producto{" "}
          <span className="font-medium text-ink">{producto?.nombre}</span>
          {producto?.codigo ? (
            <span className="text-ink-faint"> ({producto.codigo})</span>
          ) : null}
          ? Esta acción no se puede deshacer.
        </>
      }
    />
  );
}
