/**
 * CancelVentaModal: confirma vaciar el carrito (wrapper sobre ConfirmModal).
 */

import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface CancelVentaModalProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function CancelVentaModal({ open, onConfirm, onClose }: CancelVentaModalProps) {
  return (
    <ConfirmModal
      open={open}
      title="¿Cancelar venta?"
      tone="danger"
      confirmLabel="Cancelar venta"
      cancelLabel="Volver"
      onConfirm={onConfirm}
      onClose={onClose}
      message="Se vaciará el carrito y se perderán los productos agregados. ¿Deseas continuar?"
    />
  );
}
