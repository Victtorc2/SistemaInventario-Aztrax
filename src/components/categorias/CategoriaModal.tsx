/**
 * CategoriaModal: modal para crear o editar una categoría.
 *
 * Si recibe `categoria`, opera en modo edición (precarga el nombre); si no,
 * en modo creación. Envuelve al CategoriaForm dentro del Modal base.
 */

import { Modal } from "@/components/ui/Modal";
import {
  CategoriaForm,
  type CategoriaFormValues,
} from "@/components/categorias/CategoriaForm";
import type { Categoria } from "@/types/categoria";

interface CategoriaModalProps {
  open: boolean;
  /** Categoría a editar; ausente = modo creación. */
  categoria?: Categoria | null;
  submitting: boolean;
  onSubmit: (values: CategoriaFormValues) => void;
  onClose: () => void;
}

export function CategoriaModal({
  open,
  categoria,
  submitting,
  onSubmit,
  onClose,
}: CategoriaModalProps) {
  const isEdit = Boolean(categoria);

  return (
    <Modal
      open={open}
      title={isEdit ? "Editar categoría" : "Nueva categoría"}
      onClose={onClose}
      closeOnOverlay={!submitting}
    >
      <CategoriaForm
        defaultValue={categoria?.nombre ?? ""}
        submitting={submitting}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
