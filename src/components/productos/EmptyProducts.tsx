/**
 * EmptyProducts: estado vacío del listado de productos.
 * Wrapper sobre EmptyState reutilizable.
 */

import { Package } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export function EmptyProducts() {
  return (
    <EmptyState
      icon={Package}
      title="No hay productos registrados"
      description="Crea un nuevo producto para empezar a gestionar tu inventario."
    />
  );
}
