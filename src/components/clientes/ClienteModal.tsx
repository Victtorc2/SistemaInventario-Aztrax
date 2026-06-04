/**
 * ClienteModal: modal para crear o editar un cliente.
 */

import { Modal } from "@/components/ui/Modal";
import { ClienteForm, type ClienteFormValues } from "@/components/clientes/ClienteForm";
import type { Cliente } from "@/types/cliente";

interface ClienteModalProps {
  open: boolean;
  cliente?: Cliente | null;
  submitting: boolean;
  onSubmit: (values: ClienteFormValues) => void;
  onClose: () => void;
}

export function ClienteModal({
  open,
  cliente,
  submitting,
  onSubmit,
  onClose,
}: ClienteModalProps) {
  return (
    <Modal
      open={open}
      title={cliente ? "Editar cliente" : "Nuevo cliente"}
      onClose={onClose}
      closeOnOverlay={!submitting}
    >
      <ClienteForm
        defaultValues={cliente}
        submitting={submitting}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
