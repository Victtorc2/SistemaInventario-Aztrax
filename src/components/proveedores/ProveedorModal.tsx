/**
 * ProveedorModal: modal para crear o editar un proveedor.
 *
 * Si recibe `proveedor`, opera en modo edición (precarga los campos); si no,
 * en modo creación. Envuelve al ProveedorForm en el Modal base reutilizable.
 */

import { Modal } from "@/components/ui/Modal";
import {
  ProveedorForm,
  type ProveedorFormValues,
} from "@/components/proveedores/ProveedorForm";
import type { Proveedor } from "@/types/proveedor";

interface ProveedorModalProps {
  open: boolean;
  proveedor?: Proveedor | null;
  submitting: boolean;
  onSubmit: (values: ProveedorFormValues) => void;
  onClose: () => void;
}

export function ProveedorModal({
  open,
  proveedor,
  submitting,
  onSubmit,
  onClose,
}: ProveedorModalProps) {
  const isEdit = Boolean(proveedor);

  return (
    <Modal
      open={open}
      title={isEdit ? "Editar proveedor" : "Nuevo proveedor"}
      onClose={onClose}
      closeOnOverlay={!submitting}
    >
      <ProveedorForm
        defaultValues={proveedor}
        submitting={submitting}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
