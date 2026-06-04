/**
 * ProductoModal: modal para crear o editar un producto.
 *
 * Pasa las listas de categorías y proveedores al formulario para poblar los
 * selects. Modo edición si recibe `producto`. Usa el Modal base reutilizable;
 * es algo más ancho (max-w-2xl) por la cantidad de campos.
 */

import { Modal } from "@/components/ui/Modal";
import { ProductoForm } from "@/components/productos/ProductoForm";
import type { Categoria } from "@/types/categoria";
import type { Proveedor } from "@/types/proveedor";
import type { Producto, ProductoPayload } from "@/types/producto";

interface ProductoModalProps {
  open: boolean;
  producto?: Producto | null;
  categorias: Categoria[];
  proveedores: Proveedor[];
  submitting: boolean;
  onSubmit: (payload: ProductoPayload) => void;
  onClose: () => void;
}

export function ProductoModal({
  open,
  producto,
  categorias,
  proveedores,
  submitting,
  onSubmit,
  onClose,
}: ProductoModalProps) {
  return (
    <Modal
      open={open}
      title={producto ? "Editar producto" : "Nuevo producto"}
      onClose={onClose}
      closeOnOverlay={!submitting}
      widthClassName="max-w-2xl"
    >
      <ProductoForm
        defaultValues={producto}
        categorias={categorias}
        proveedores={proveedores}
        submitting={submitting}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
